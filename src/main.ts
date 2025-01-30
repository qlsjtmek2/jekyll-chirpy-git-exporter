import { Notice, Plugin, TFile } from 'obsidian';
import { Settings, DEFAULT_SETTINGS, SettingTab } from './settings';
import { PostConvertor } from './PostConvertor';
import { PostMetadataGenerator, ChirpyPostMetadataGenerator } from './PostMetadataGenerator';
import { PostRenamer, ChirpyFilenameFormatter } from './PostRenamer';
import { PostExporter, ChirpyPostExporter } from './PostExporter';
import { FileGetter, ObsidianToExportFileGetter, OldPathToExportFileGetter } from './FileGetter';
import { Preprocessor, ChirpyPreprocessor } from './Preprocessor';
import { GitUploader } from './GitUploader';
import { ImagePathCollector } from './ImagePathCollector';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { unixToDate } from './Utils';
import { getText } from './ReferenceText';

export default class Main extends Plugin {
	settings: Settings;
	// private statusBarItemEl: HTMLElement;
	// private eventQueue: UniqueQueue<FileEvent>;
	private postConvertor: PostConvertor;
	private postRenamer: PostRenamer;
	private postMetadataGenerator: PostMetadataGenerator;
	private fileGetter: FileGetter<TFile>;
	private oldPathFileGetter: FileGetter<string>;
	private postExporter: PostExporter;
	private preprocessor: Preprocessor;
	private gitUploader: GitUploader | null = null;
	private imageCollector: ImagePathCollector;
	
	private getText() {
		return getText(this.settings.language);
	}

	async onload() {
		await this.loadSettings();

		// this.eventQueue = new UniqueQueue<FileEvent>(isFileEventEqual);
		this.postConvertor = new PostConvertor(this.app);
		this.postMetadataGenerator = new ChirpyPostMetadataGenerator(this.settings.openAIKey, 
			this.settings.preprocessingOptions.enableAutoTagging, 
			this.settings.blogPostPath,
			this);
		this.postRenamer = new ChirpyFilenameFormatter();
		this.fileGetter = new ObsidianToExportFileGetter(this.app, this.settings.exportPath, this.postRenamer);
		this.oldPathFileGetter = new OldPathToExportFileGetter(this.app);
		this.postExporter = new ChirpyPostExporter(this.app.vault);
		this.imageCollector = new ImagePathCollector();
		this.preprocessor = new ChirpyPreprocessor(this.imageCollector);

		const updateBlogPostIconEl = this.addRibbonIcon(
			this.getText().ribbon.exportPost.icon,
			this.getText().ribbon.exportPost.tooltip,
			(evt: MouseEvent) => {
				const file = this.app.workspace.getActiveFile();
				if (file instanceof TFile) {
					this.requestExportPost([file]);
				} else {
					new Notice(this.getText().notice.noActiveFile);
				}
			}
		);
		updateBlogPostIconEl.addClass('blog-sync-ribbon-icon');

		this.addSettingTab(new SettingTab(this.app, this));
		
		this.registerCommands();

		// this.statusBarItemEl = this.addStatusBarItem();
		// this.updateStatusBar();

		// this.registerFileEventListeners();
        // this.registerInterval(window.setInterval(() => this.requestEventProcessing(false), this.settings.workInterval));

		if (this.settings.gitConfig.enabled) {
			this.gitUploader = new GitUploader(this.settings.gitConfig, this.app.vault, this);
		}

		// 컨텍스트 메뉴 수정
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				menu.addItem((item) => {
					if (file instanceof TFile) {
						item
							.setTitle(this.getText().menu.exportPost.singleFile)
							.setIcon(this.getText().menu.exportPost.icon)
							.onClick(async () => {
								await this.requestExportPost([file]);
							});
					} else {
						const files = this.app.vault.getFiles()
							.filter(f => f.path.startsWith(file.path + '/') && this.isInBlogPostPath(f.path));
						item
							.setTitle(this.getText().menu.exportPost.multipleFiles(files.length))
							.setIcon(this.getText().menu.exportPost.icon)
							.onClick(async () => {
								if (files.length > 0) {
									await this.requestExportPost(files);
								} else {
									new Notice(this.getText().notice.noFilesInBlogPath);
								}
							});
					}
				});
			})
		);

		// 삭제 메뉴 수정
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				if (file instanceof TFile) {
					if (file.path.startsWith(this.settings.blogPostPath)) {
						menu.addItem((item) => {
							item
								.setTitle(this.getText().menu.deletePost.singleFile)
								.setIcon(this.getText().menu.deletePost.icon)
								.onClick(async () => {
									await this.requestDeletePost([file]);
								});
						});
					}
				} else {
					const files = this.app.vault.getFiles()
						.filter(f => f.path.startsWith(file.path + '/') && 
							f.path.startsWith(this.settings.blogPostPath));
					
					if (files.length > 0) {
						menu.addItem((item) => {
							item
								.setTitle(this.getText().menu.deletePost.multipleFiles(files.length))
								.setIcon(this.getText().menu.deletePost.icon)
								.onClick(async () => {
									await this.requestDeletePost(files);
								});
						});
					}
				}
			})
		);

		// 커맨드 등록 수정
		this.addCommand({
			id: this.getText().commands.exportPost.id,
			name: this.getText().commands.exportPost.name,
			callback: () => {
				const file = this.app.workspace.getActiveFile();
				if (file instanceof TFile) {
					this.requestExportPost([file]);
				} else {
					new Notice(this.getText().notice.noActiveFile);
				}
			}
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.reloadObjects();
	}

	private reloadObjects() {
		this.postMetadataGenerator = new ChirpyPostMetadataGenerator(
			this.settings.openAIKey, 
			this.settings.preprocessingOptions.enableAutoTagging,
			this.settings.blogPostPath,
			this
		);
		this.fileGetter = new ObsidianToExportFileGetter(
			this.app, 
			this.settings.exportPath, 
			this.postRenamer
		);
		this.preprocessor = new ChirpyPreprocessor(this.imageCollector);

		if (this.settings.gitConfig.enabled) {
			this.gitUploader = new GitUploader(this.settings.gitConfig, this.app.vault, this);
		} else {
			this.gitUploader = null;
		}
	}

	private registerCommands() {
		this.addCommand({
			id: 'process-event-queue',
			name: 'Export blog post',
			callback: () => {
				const file = this.app.workspace.getActiveFile();
				if (file instanceof TFile) {
					this.requestExportPost([file]);
				} else {
					new Notice('No active file.');
				}
			}
		});

		this.addCommand({
			id: 'export-all-posts',
			name: 'Export all blog post files',
			callback: () => {
				this.exportAllPosts();
			}
		});

		this.addCommand({
			id: 'delete-blog-post',
			name: 'Delete blog post',
			checkCallback: (checking: boolean): boolean => {
				const activeFile = this.app.workspace.getActiveFile();
				
				const isValidFile = activeFile && 
					activeFile instanceof TFile && 
					activeFile.path.startsWith(this.settings.blogPostPath);

				if (isValidFile == null) {
					new Notice('Current file is not a blog post.');
					return false;
				}

				if (checking) {
					return isValidFile;
				}

				if (isValidFile) {
					this.requestDeletePost([activeFile]);
				}
				
				return isValidFile;
			}
		});
	}
	
	private isInBlogPostPath(filePath: string): boolean {
		const blogPath = this.settings.blogPostPath;
		return filePath.startsWith(blogPath + '/');
	}
	
	private async requestExportPost(files: TFile[]) {
		if (!files.length) {
			new Notice(this.getText().notice.invalidFile);
			return;
		}

		if (!files.every(file => this.isInBlogPostPath(file.path))) {
			new Notice(this.getText().notice.notInBlogPath);
			return;
		}

		new Notice(this.getText().notice.startExport(files.length));

		const processedFiles: { path: string; content: string }[] = [];
		this.imageCollector.clear();

		// 각 파일 처리
		for (const file of files) {
			const exportFile = this.fileGetter.get(file);
			if (exportFile instanceof TFile) {
				await this.app.fileManager.trashFile(exportFile);
			}

			const post = await this.postConvertor.convert(file);
			post.setMetadata(await this.postMetadataGenerator.generate(post));
			post.setContent(this.preprocessor.preprocess(post.getContent(), this.settings));
			const newFileName = this.postRenamer.rename(post.getTitle(), post.getMetadata());
			
			await this.postExporter.export(post, this.settings.exportPath, newFileName);

			// 처리된 파일 정보 저장
			const exportedFilePath = `${this.settings.exportPath}/${newFileName}`;
			const exportedContent = await this.app.vault.adapter.read(exportedFilePath);
			processedFiles.push({
				path: newFileName,
				content: exportedContent
			});
		}

		// Git 업로드
		if (this.gitUploader && this.settings.gitConfig.enabled) {
			try {
				// 이미지 파일 준비
				const images = await Promise.all(
					this.imageCollector.getImages().map(async img => {
						const imageFile = this.app.vault.getAbstractFileByPath(img.localPath);
						if (!(imageFile instanceof TFile)) {
							console.error(`Image file not found: ${img.localPath}`);
							return null;
						}
						const content = await this.app.vault.readBinary(imageFile);
						return { 
							path: `${this.settings.gitConfig.uploadImagePath}/${img.uploadPath.split('/').pop()}`,
							content: Buffer.from(content).toString('base64'),
							encoding: 'base64'
						};
					})
				);

				// 포스트 파일 준비
				const posts = processedFiles.map(file => ({
					path: `_posts/${file.path}`,
					content: file.content,
					encoding: 'utf-8'
				}));

				// 유효한 이미지만 필터링
				const validImages = images.filter((img): img is { path: string; content: string; encoding: string } => 
					img !== null
				);

				// 모든 파일을 하나의 배열로 합치기
				const allFiles = [...posts, ...validImages];

				const commitMessage = this.settings.gitConfig.commitMessageTemplate
					.replace('{count}', processedFiles.length.toString());

				// 포스트와 이미지를 함께 업로드
				await this.gitUploader.uploadFiles(allFiles, commitMessage);

				new Notice(this.getText().notice.gitUploadSuccess);
				this.imageCollector.clear();
			} catch (error) {
				console.error('Git upload failed:', error);
				new Notice(this.getText().notice.gitUploadFailed);
				throw error;
			}
		}

		new Notice(this.getText().notice.exportSuccess(files.length));
	}

	private async requestDeletePost(files: TFile[]) {
		if (!files.length) {
			new Notice(this.getText().notice.invalidFile);
			return;
		}

		if (!files.every(file => this.isInBlogPostPath(file.path))) {
			new Notice(this.getText().notice.notInBlogPath);
			return;
		}

		if (this.settings.gitConfig.deleteConfirmation) {
			const modal = new DeleteConfirmModal(this.app, 
				files.length === 1 ? files[0].name : `${files.length}개의 파일`, 
				this);
			modal.open();
			const confirmed = await modal.waitForResult();
			if (!confirmed) return;
		}

		try {
			// Git 저장소에서 삭제
			if (this.gitUploader) {
				const fileNames = files.map(file => {
					return this.postRenamer.rename(file.basename, {
						title: file.basename,
						date: unixToDate(file.stat.ctime)
					});
				});
				await this.gitUploader.deletePosts(fileNames);
			}

			// Export Path 내의 파일들 찾기 및 삭제 (선택적)
			const exportFiles = files.map(file => {
				const expectedFileName = this.postRenamer.rename(file.basename, {
					title: file.basename,
					date: unixToDate(file.stat.ctime)
				});
				return this.app.vault.getFiles()
					.find(f => f.path === `${this.settings.exportPath}/${expectedFileName}`);
			}).filter((f): f is TFile => f !== undefined);

			// 존재하는 export 파일들 삭제
			for (const exportFile of exportFiles) {
				await this.app.fileManager.trashFile(exportFile);
			}
		} catch (error) {
			new Notice(this.getText().notice.deletePostFailed(error.message));
		}
	}

	private async exportAllPosts() {
		const files = this.app.vault.getFiles()
			.filter(file => this.isInBlogPostPath(file.path));
		
		if (files.length === 0) {
			new Notice(this.getText().notice.noFilesInBlogPath);
			return;
		}

		await this.requestExportPost(files);
	}
}