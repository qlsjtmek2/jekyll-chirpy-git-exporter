import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile } from 'obsidian';
import { Settings, DEFAULT_SETTINGS, SettingTab } from './settings';
import { UniqueQueue } from './UniqueQueue';
import { PostConvertor } from './PostConvertor';
import { PostMetadataGenerator, ChirpyPostMetadataGenerator } from './PostMetadataGenerator';
import { PostRenamer, ChirpyFilenameFormatter } from './PostRenamer';
import { PostExporter, ChirpyPostExporter } from './PostExporter';
import { FileGetter, ObsidianToExportFileGetter, OldPathToExportFileGetter } from './FileGetter';
import { Preprocessor, ChirpyPreprocessor } from './Preprocessor';
import { GitUploader, GitConfig } from './GitUploader';
import { ImagePathCollector } from './ImagePathCollector';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { unixToDate } from './Utils';

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
	
	async onload() {
		await this.loadSettings();

		// this.eventQueue = new UniqueQueue<FileEvent>(isFileEventEqual);
		this.postConvertor = new PostConvertor(this.app);
		this.postMetadataGenerator = new ChirpyPostMetadataGenerator(this.settings.openAIKey, this.settings.preprocessingOptions.enableAutoTagging, this.settings.blogPostPath);
		this.postRenamer = new ChirpyFilenameFormatter();
		this.fileGetter = new ObsidianToExportFileGetter(this.app, this.settings.exportPath, this.postRenamer);
		this.oldPathFileGetter = new OldPathToExportFileGetter(this.app);
		this.postExporter = new ChirpyPostExporter(this.app.vault);
		this.imageCollector = new ImagePathCollector();
		this.preprocessor = new ChirpyPreprocessor(this.imageCollector);

		const updateBlogPostIconEl = this.addRibbonIcon('book-up-2', 'Export Blog Post', (evt: MouseEvent) => {
			const file = this.app.workspace.getActiveFile();
			if (file instanceof TFile) {
				this.requestExportPost([file]);
			} else {
				new Notice('활성화된 파일이 없습니다.');
			}
		});
		updateBlogPostIconEl.addClass('blog-sync-ribbon-icon');

		this.addSettingTab(new SettingTab(this.app, this));
		
		this.registerCommands();

		// this.statusBarItemEl = this.addStatusBarItem();
		// this.updateStatusBar();

		// this.registerFileEventListeners();
        // this.registerInterval(window.setInterval(() => this.requestEventProcessing(false), this.settings.workInterval));

		if (this.settings.gitConfig.enabled) {
			this.gitUploader = new GitUploader(this.settings.gitConfig, this.app.vault);
		}

		// 컨텍스트 메뉴 추가
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				menu.addItem((item) => {
					if (file instanceof TFile) {
						item
							.setTitle('Export Post')
							.setIcon('book-up-2')
							.onClick(async () => {
								await this.requestExportPost([file]);
							});
					} else {
						// 폴더인 경우
						const files = this.app.vault.getFiles()
							.filter(f => f.path.startsWith(file.path + '/') && this.isInBlogPostPath(f.path));
						item
							.setTitle(`Export Posts (${files.length})`)
							.setIcon('book-up-2')
							.onClick(async () => {
								if (files.length > 0) {
									await this.requestExportPost(files);
								} else {
									new Notice('블로그 포스트 경로에 파일이 없습니다.');
								}
							});
					}
				});
			})
		);

		// 파일 컨텍스트 메뉴에 삭제 명령 추가
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				if (file instanceof TFile) {
					// 파일인 경우
					if (file.path.startsWith(this.settings.blogPostPath)) {
						menu.addItem((item) => {
							item
								.setTitle('Delete Post')
								.setIcon('trash')
								.onClick(async () => {
									await this.requestDeletePost([file]);
								});
						});
					}
				} else {
					// 폴더인 경우
					const files = this.app.vault.getFiles()
						.filter(f => f.path.startsWith(file.path + '/') && 
							f.path.startsWith(this.settings.blogPostPath));
					
					if (files.length > 0) {
						menu.addItem((item) => {
							item
								.setTitle(`Delete Posts (${files.length})`)
								.setIcon('trash')
								.onClick(async () => {
									await this.requestDeletePost(files);
								});
						});
					}
				}
			})
		);
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
			this.settings.blogPostPath
		);
		this.fileGetter = new ObsidianToExportFileGetter(
			this.app, 
			this.settings.exportPath, 
			this.postRenamer
		);
		this.preprocessor = new ChirpyPreprocessor(this.imageCollector);

		if (this.settings.gitConfig.enabled) {
			this.gitUploader = new GitUploader(this.settings.gitConfig, this.app.vault);
		} else {
			this.gitUploader = null;
		}
	}

	private registerCommands() {
		this.addCommand({
			id: 'process-event-queue',
			name: 'Export Blog Post',
			callback: () => {
				const file = this.app.workspace.getActiveFile();
				if (file instanceof TFile) {
					this.requestExportPost([file]);
				} else {
					new Notice('활성화된 파일이 없습니다.');
				}
			}
		});

		this.addCommand({
			id: 'export-all-posts',
			name: 'All Export in Blog Post Path',
			callback: () => {
				this.exportAllPosts();
			}
		});

		this.addCommand({
			id: 'delete-blog-post',
			name: 'Delete Blog Post',
			checkCallback: (checking: boolean): boolean => {
				const activeFile = this.app.workspace.getActiveFile();
				
				const isValidFile = activeFile && 
					activeFile instanceof TFile && 
					activeFile.path.startsWith(this.settings.blogPostPath);

				if (isValidFile == null) {
					new Notice('현재 파일은 블로그 포스트가 아닙니다.');
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
			new Notice('유효하지 않은 파일입니다.');
			return;
		}

		// 모든 파일이 블로그 포스트 경로에 있는지 확인
		if (!files.every(file => this.isInBlogPostPath(file.path))) {
			new Notice('선택된 파일 중 블로그 포스트 경로에 속하지 않는 파일이 있습니다.');
			return;
		}

		new Notice(`${files.length}개의 파일 내보내기를 시작합니다...`);

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

				new Notice('블로그 포스트와 이미지 Git 업로드 완료');
				this.imageCollector.clear();
			} catch (error) {
				console.error('Git 업로드 실패:', error);
				new Notice('Git 업로드 실패');
				throw error;
			}
		}

		new Notice(`${files.length}개의 블로그 포스트 내보내기 완료`);
	}

	private async requestDeletePost(files: TFile[]) {
		if (!files.length) {
			new Notice('유효하지 않은 파일입니다.');
			return;
		}

		// 모든 파일이 블로그 포스트 경로에 있는지 확인
		if (!files.every(file => this.isInBlogPostPath(file.path))) {
			new Notice('선택된 파일 중 블로그 포스트 경로에 속하지 않는 파일이 있습니다.');
			return;
		}

		if (this.settings.gitConfig.deleteConfirmation) {
			const modal = new DeleteConfirmModal(this.app, 
				files.length === 1 ? files[0].name : `${files.length}개의 파일`);
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
				await this.app.vault.delete(exportFile);
			}
		} catch (error) {
			new Notice('게시물 삭제 실패: ' + error.message);
		}
	}

	private async exportAllPosts() {
		const files = this.app.vault.getFiles()
			.filter(file => this.isInBlogPostPath(file.path));
		
		if (files.length === 0) {
			new Notice('블로그 포스트 경로에 파일이 없습니다.');
			return;
		}

		await this.requestExportPost(files);
	}
}