import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';

export interface Settings {
	blogPostPath: string;      // 옵시디언 내 블로그 포스트 폴더 경로
	exportPath: string;         // 전처리된 .md 파일을 내보낼 폴더 경로
	// workInterval: number;      // 작업 처리 주기 (밀리초 단위)
	openAIKey: string;        // OpenAI API Key
	blogUrl: string;          // 블로그 URL
	preprocessingOptions: {
		enableCallout: boolean;      // 콜아웃 전처리
		calloutTitleSeparator: string; // 콜아웃 타이틀 구분자
		enableHighlight: boolean;    // 하이라이트 전처리
		enableDocLink: boolean;      // 문서 링크 전처리
		enableDocRef: boolean;       // 문서 참조 전처리
		enableImage: boolean;        // 이미지 전처리
		imagePosition: 'normal' | 'left' | 'right';  // 이미지 위치
		imageShadow: boolean;        // 이미지 그림자 효과
		highlightSeparator: string;  // 하이라이트 구분자
		enableAutoTagging: boolean;  // 자동 태깅 활성화 여부
		enableRawTag: boolean;        // 이중 중괄호 raw 태그 변환 활성화
		enableMathNotation: boolean;  // 수식 표기법 전처리 활성화
		enableMathEscape: boolean;    // 수식 내 밑줄 이스케이프 활성화
		enableMathLineBreak: boolean;    // 수식 줄바꿈 활성화 여부
		enableMathPipe: boolean;        // 수식 내 파이프(|)를 \mid로 변환
		enableMatrixLineBreak: boolean; // matrix 환경에서 줄바꿈(\\)을 \\\로 변환
		enableCalloutAutoTitle: boolean;  // 콜아웃 빈 제목을 type으로 채우기
		enableInlineToDisplay: boolean;  // 인라인 수식을 디스플레이 수식으로 변환
	};
	gitConfig: {
		enabled: boolean;
		owner: string;
		repo: string;
		branch: string;
		token: string;
		uploadPostPath: string;
		uploadImagePath: string;
		commitMessageTemplate: string;
		imagePath: string; // 옵시디언 내의 이미지 경로
	};
}

export const DEFAULT_SETTINGS: Settings = {
	blogPostPath: 'Blog/Posts',
	exportPath: 'C:/Users/Desktop/_posts',
	// workInterval: 5 * 60 * 1000,   // 기본값: 5분
	openAIKey: '',
	blogUrl: 'https://username.github.io',
	preprocessingOptions: {
		enableAutoTagging: true,
		enableCallout: true,
		calloutTitleSeparator: '{title}',
		enableHighlight: true,
		highlightSeparator: '**',
		enableDocLink: true,
		enableDocRef: true,
		enableImage: true,
		imagePosition: 'normal',
		imageShadow: false,
		enableRawTag: true,
		enableMathNotation: true,
		enableMathEscape: true,
		enableMathLineBreak: true,
		enableMathPipe: true,
		enableMatrixLineBreak: true,
		enableCalloutAutoTitle: true,
		enableInlineToDisplay: false,
	},
	gitConfig: {
		enabled: false,
		owner: '',
		repo: '',
		branch: 'main',
		token: '',
		uploadPostPath: '_posts',
		uploadImagePath: 'assets/img/posts',
		commitMessageTemplate: 'docs: add {count} posts',
		imagePath: 'assets/img'
	}
}

export class SettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Plugin Settings' });

		new Setting(containerEl)
			.setName('Blog Post Path')
			.setDesc('옵시디언 내에서 블로그 포스트로 사용될 폴더의 경로를 지정합니다.')
			.addText(text => text
				.setPlaceholder('예: Blog Posts')
				.setValue(this.plugin.settings.blogPostPath)
				.onChange(async (value) => {
					this.plugin.settings.blogPostPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Export Path')
			.setDesc('전처리된 .md 파일을 내보낼 폴더의 경로를 지정합니다.')
			.addText(text => text
				.setPlaceholder('예: Exported Posts')
				.setValue(this.plugin.settings.exportPath)
				.onChange(async (value) => {
					this.plugin.settings.exportPath = value;
					await this.plugin.saveSettings();
				}));

		// new Setting(containerEl)
		// 	.setName('Work Interval (ms)')
		// 	.setDesc('작업을 처리할 주기를 밀리초 단위로 지정합니다. 예: 300000 (5분)')
		// 	.addText(text => text
		// 		.setPlaceholder('예: 300000')
		// 		.setValue(this.plugin.settings.workInterval.toString())
		// 		.onChange(async (value) => {
		// 			const parsed = parseInt(value);
		// 			if (!isNaN(parsed) && parsed > 0) {
		// 				this.plugin.settings.workInterval = parsed;
		// 				await this.plugin.saveSettings();
		// 			} else {
		// 				new Notice('유효한 숫자를 입력해주세요.');
		// 			}
		// 		}));

		new Setting(containerEl)
			.setName('OpenAI API Key')
			.setDesc('OpenAI API를 사용하기 위한 API 키를 입력하세요.')
			.addText(text => text
				.setPlaceholder('sk-...')
				.setValue(this.plugin.settings.openAIKey)
				.onChange(async (value) => {
					this.plugin.settings.openAIKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('블로그 URL')
			.setDesc('블로그 URL을 입력하세요. (끝에 / 미포함)')
			.addText(text => text
				.setPlaceholder('https://your-blog.com')
				.setValue(this.plugin.settings.blogUrl)
				.onChange(async (value) => {
					this.plugin.settings.blogUrl = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h3', { text: '전처리 옵션' });

		new Setting(containerEl)
			.setName('자동 태깅')
			.setDesc('OpenAI를 사용한 자동 태깅 기능을 활성화/비활성화합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableAutoTagging)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableAutoTagging = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('콜아웃 전처리')
			.setDesc('콜아웃 블록의 전처리를 활성화/비활성화합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableCallout)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableCallout = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('콜아웃 타이틀 구분자')
			.setDesc('콜아웃 블록의 타이틀을 구분하는 문자열을 지정합니다.')
			.addText(text => text
				.setPlaceholder('{title}')
				.setValue(this.plugin.settings.preprocessingOptions.calloutTitleSeparator)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.calloutTitleSeparator = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('콜아웃 자동 제목')
			.setDesc('콜아웃의 제목이 비어있을 때 type을 제목으로 사용합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableCalloutAutoTitle)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableCalloutAutoTitle = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('하이라이트 전처리')
			.setDesc('하이라이트 텍스트의 전처리를 활성화/비활성화합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableHighlight)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableHighlight = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('하이라이트 구분자')
			.setDesc('하이라이트 텍스트를 감싸는 문자열을 지정합니다.')
			.addText(text => text
				.setPlaceholder('**')
				.setValue(this.plugin.settings.preprocessingOptions.highlightSeparator)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.highlightSeparator = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('문서 링크 전처리')
			.setDesc('문서 링크의 전처리를 활성화/비활성화합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableDocLink)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableDocLink = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('문서 참조 전처리')
			.setDesc('문서 참조의 전처리를 활성화/비활성화합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableDocRef)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableDocRef = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('이미지 전처리')
			.setDesc('이미지의 전처리를 활성화/비활성화합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableImage)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableImage = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('이미지 위치')
			.setDesc('이미지의 기본 정렬 위치를 설정합니다.')
			.addDropdown(dropdown => dropdown
				.addOption('normal', '기본')
				.addOption('left', '왼쪽')
				.addOption('right', '오른쪽')
				.setValue(this.plugin.settings.preprocessingOptions.imagePosition)
				.onChange(async (value: 'normal' | 'left' | 'right') => {
					this.plugin.settings.preprocessingOptions.imagePosition = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('이미지 그림자')
			.setDesc('이미지에 그림자 효과를 적용합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.imageShadow)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.imageShadow = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('이중 중괄호 Raw 태그 변환')
			.setDesc('수식 내 이중 중괄호를 {% raw %} 태그로 변환합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableRawTag)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableRawTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('수식 표기법 전처리')
			.setDesc('수식에서 위/아래 첨자의 순서를 LaTeX 표준 형식으로 변환합니다. 예: $\sum^n_{i=1}a_i$ -> $\sum_{i=1}^na_i$')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableMathNotation)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableMathNotation = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('수식 내 밑줄 이스케이프')
			.setDesc('수식 내의 이스케이프되지 않은 밑줄(_)을 이스케이프(\_)합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableMathEscape)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableMathEscape = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('수식 줄바꿈 처리')
			.setDesc('디스플레이 수식($$...$$)의 앞뒤에 줄바꿈을 추가합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableMathLineBreak)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableMathLineBreak = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('수식 내 파이프라인 변환')
			.setDesc('수식 내의 파이프(|)를 \\mid로 변환합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableMathPipe)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableMathPipe = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('매트릭스 줄바꿈 공백 추가')
			.setDesc('matrix 환경에서 줄바꿈(\\\\) 양 옆에 공백을 추가합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableMatrixLineBreak)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableMatrixLineBreak = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('인라인 수식을 디스플레이 수식으로 변환')
			.setDesc('단일 달러($)로 둘러싸인 인라인 수식을 이중 달러($$)로 변환합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableInlineToDisplay)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableInlineToDisplay = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h3', { text: 'Git 설정' });

		new Setting(containerEl)
			.setName('Git 업로드 활성화')
			.setDesc('GitHub에 자동으로 파일을 업로드합니다.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.gitConfig.enabled)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.enabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('저장소 소유자')
			.setDesc('GitHub 저장소 소유자의 사용자명을 입력하세요.')
			.addText(text => text
				.setPlaceholder('username')
				.setValue(this.plugin.settings.gitConfig.owner)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.owner = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('저장소 이름')
			.setDesc('GitHub 저장소 이름을 입력하세요.')
			.addText(text => text
				.setPlaceholder('repository-name')
				.setValue(this.plugin.settings.gitConfig.repo)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.repo = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('브랜치')
			.setDesc('업로드할 브랜치 이름을 입력하세요.')
			.addText(text => text
				.setPlaceholder('main')
				.setValue(this.plugin.settings.gitConfig.branch)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.branch = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('GitHub 토큰')
			.setDesc('GitHub Personal Access Token을 입력하세요.')
			.addText(text => text
				.setPlaceholder('ghp_...')
				.setValue(this.plugin.settings.gitConfig.token)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.token = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('포스트 업로드 경로')
			.setDesc('블로그 포스트가 업로드될 Git Repository 내 경로를 입력하세요.')
			.addText(text => text
				.setPlaceholder('_posts')
				.setValue(this.plugin.settings.gitConfig.uploadPostPath)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.uploadPostPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('이미지 업로드 경로')
			.setDesc('이미지 파일이 업로드될 Git Repository 내 경로를 입력하세요.')
			.addText(text => text
				.setPlaceholder('assets/img/posts')
				.setValue(this.plugin.settings.gitConfig.uploadImagePath)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.uploadImagePath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('커밋 메시지 템플릿')
			.setDesc('파일 업로드 시 사용할 커밋 메시지 템플릿. {count}는 업로드된 파일 개수를 의미합니다.')
			.addText(text => text
				.setPlaceholder('Update: {filename}')
				.setValue(this.plugin.settings.gitConfig.commitMessageTemplate)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.commitMessageTemplate = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('이미지 경로')
			.setDesc('옵시디언 내의 이미지 파일이 저장된 경로를 입력하세요.')
			.addText(text => text
				.setPlaceholder('assets/img')
				.setValue(this.plugin.settings.gitConfig.imagePath)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.imagePath = value;
						await this.plugin.saveSettings();
				}));
	}
}