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
import { CreatedDateModal } from './CreatedDateModal';

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
					item
						.setTitle('Export Post')
						.setIcon('book-up-2')
						.onClick(async () => {
							if (file instanceof TFile) {
								await this.requestExportPost([file]);
							} else {
								// 폴더인 경우
								const files = this.app.vault.getFiles()
									.filter(f => f.path.startsWith(file.path + '/') && this.isInBlogPostPath(f.path));
								if (files.length > 0) {
									await this.requestExportPost(files);
								} else {
									new Notice('블로그 포스트 경로에 파일이 없습니다.');
								}
							}
						});
				});
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
	}

	// private registerFileEventListeners() {
	// 	// 파일 생성 이벤트
	// 	this.registerEvent(
	// 		this.app.vault.on('create', (file) => {
	// 			if (file instanceof TFile && this.isInBlogPostPath(file.path)) {
	// 				this.eventQueue.enqueue({ type: 'create', file })
	// 				this.updateStatusBar();
	// 			}
	// 		})
	// 	);

	// 	// 파일 삭제 이벤트
	// 	this.registerEvent(
	// 		this.app.vault.on('delete', (file) => {
	// 			if (file instanceof TFile && this.isInBlogPostPath(file.path)) {
	// 				this.eventQueue.enqueue({ type: 'delete', file });
	// 				this.updateStatusBar();
	// 			}
	// 		})
	// 	);

	// 	// 파일 수정 이벤트
	// 	this.registerEvent(
	// 		this.app.vault.on('modify', (file) => {
	// 			if (file instanceof TFile && this.isInBlogPostPath(file.path)) {
	// 				this.eventQueue.enqueue({ type: 'modify', file });
	// 				this.updateStatusBar();
	// 			}
	// 		})
	// 	);

	// 	// 파일 이름 변경 이벤트
	// 	this.registerEvent(
	// 		this.app.vault.on('rename', (file, oldPath) => {
	// 			if (file instanceof TFile && this.isInBlogPostPath(file.path)) {
	// 				this.eventQueue.enqueue({ type: 'rename', file: file, info: oldPath });
	// 				this.updateStatusBar();
	// 			}
	// 		})
	// 	);
	// }
	
	private isInBlogPostPath(filePath: string): boolean {
		const blogPath = this.settings.blogPostPath;
		return filePath.startsWith(blogPath + '/');
	}

	// private updateStatusBar() {
	// 	this.statusBarItemEl.setText(`대기 중인 작업: ${this.eventQueue.size()}개`);
	// }
	
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
				await this.app.vault.delete(exportFile);
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

	private async exportAllPosts() {
		const files = this.app.vault.getFiles()
			.filter(file => this.isInBlogPostPath(file.path));
		
		if (files.length === 0) {
			new Notice('블로그 포스트 경로에 파일이 없습니다.');
			return;
		}

		await this.requestExportPost(files);
	}

	// private requestEventProcessing(showNotice: boolean = true) {
    //     const queueSize = this.eventQueue.size();
    //     if (queueSize > 0) {
    //         this.processEvents();
    //         if (showNotice) {
    //             new Notice(`${queueSize}개의 작업 처리 시작...`);
    //         }
    //     } else if (showNotice) {
    //         new Notice('처리할 작업이 없습니다.');
    //     }
	// }
    
	// async processEvents() {
	// 	if (this.eventQueue.isEmpty()) {
	// 		console.log('Event queue is empty.');
	// 		return;
	// 	}

	// 	console.log(`Processing ${this.eventQueue.size()} events...`);

	// 	while (!this.eventQueue.isEmpty()) {
	// 		const event = this.eventQueue.dequeue();
			
	// 		if (event) {
	// 			switch (event.type) {
	// 				case 'create':
	// 					this.handleCreateEvent(event.file);
	// 					break;
	// 				case 'delete':
	// 					this.handleDeleteEvent(event.file);
	// 					break;
	// 				case 'modify':
	// 					this.handleModifyEvent(event.file);
	// 					break;
	// 				case 'rename':
	// 					this.handleRenameEvent(event.file, event.info);
	// 					break;
	// 			}
	// 		}

	// 		this.updateStatusBar();
	// 	}
	// }

	// private async handleCreateEvent(file: TFile) {
	// 	/* 
	// 	파일 경로를 통해 Post 객체를 얻어내고
	// 	Property 추가하고
	// 	문법 전처리 하고
	// 	파일 제목 수정하고
	// 	Export Path에 내보내기.
	// 	*/
		
	// 	console.log(`Handling create event for ${file.path}`);

	// 	const post = await this.postConvertor.convert(file);
	// 	post.setMetadata(await this.postMetadataGenerator.generate(post));
	// 	post.setContent(this.preprocessor.preprocess(post.getContent()));
	// 	const newFileName = this.postRenamer.rename(post.getTitle(), post.getMetadata());
	// 	this.postExporter.export(post, this.settings.exportPath, newFileName);
	// }

	// private async handleDeleteEvent(file: TFile) {
	// 	/*
	// 	삭제된 File의 제목을 통해 ExportPath의 파일을 얻어내고
	// 	그 파일을 삭제하기
	// 	*/

	// 	console.log(`Handling delete event for ${file.path}`);

	// 	const exportFile = this.fileGetter.get(file);
	// 	if (!(exportFile instanceof TFile)) {
	// 		console.log(`No matching file found in export path for: ${file.basename}`);
	// 		return;
	// 	}
		
	// 	await this.app.vault.delete(exportFile);

	// 	console.log(`Deleted file: ${exportFile.path}`);
	// }

	// private async handleRenameEvent(file: TFile, oldPath: string | undefined) {
	// 	/*
	// 	Post를 얻어내고
	// 	File의 제목을 통해 ExportPath의 파일을 얻어내고
	// 	파일 이름을 바꾸기
	// 	파일 속성의 이름부분을 바꾸기
	// 	*/

	// 	console.log(`Handling rename event for ${file.path}`);
		
	// 	if (!oldPath) {
	// 		console.log(`No old path found for: ${file.path}`);
	// 		return;
	// 	}
		
	// 	const post = await this.postConvertor.convert(file);
	// 	const exportFile = this.oldPathFileGetter.get(oldPath);
	// 	if (!(exportFile instanceof TFile)) {
	// 		console.log(`No matching file found in export path for: ${oldPath}`);
	// 		return;
	// 	}
		
	// 	const newFileName = this.postRenamer.rename(post.getTitle(), post.getMetadata());
	// 	const newPath = `${this.settings.exportPath}/${newFileName}`;
		
	// 	await this.app.vault.rename(exportFile, newPath);

	// 	// this.filePropertyEditor.edit(exportFile, newPath);

	// 	console.log(`Renamed file from ${exportFile.path} to ${newPath}`);
	// }

	// private async handleModifyEvent(file: TFile) {
	// 	/*
	// 	File의 제목을 통해 ExportPath의 파일을 얻어내고
	// 	Export TFile, Source TFile을 Post화하기
	// 	Export Post의 Property 복사
	// 	Source Post의 Property에 덮어쓰기
	// 	export TFile 삭제
	// 	Source Post 전처리
	// 	Source Post 내보내기
	// 	*/

	// 	console.log(`Handling modify event for ${file.path}`);

	// 	const exportFile = this.fileGetter.get(file);
	// 	if (!(exportFile instanceof TFile)) {
	// 		console.log(`No matching file found in export path for: ${file.basename}`);
	// 		return;
	// 	}

	// 	const exportPost = await this.postConvertor.convert(exportFile);
	// 	const sourcePost = await this.postConvertor.convert(file);

	// 	sourcePost.setMetadata(exportPost.getMetadata());

	// 	await this.app.vault.delete(exportFile);
		
	// 	sourcePost.setContent(this.preprocessor.preprocess(sourcePost.getContent()));
	// 	const fileName = this.postRenamer.rename(sourcePost.getTitle(), sourcePost.getMetadata());
	// 	this.postExporter.export(sourcePost, this.settings.exportPath, fileName);
	// }
}