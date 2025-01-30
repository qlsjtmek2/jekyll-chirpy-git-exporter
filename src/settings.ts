import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';
import { getText } from './ReferenceText';

export interface Settings {
	language: 'en' | 'ko' | 'zh' | 'ja' | 'es' | 'de' | 'ru';  // 'ru' 추가
	blogPostPath: string;      // 옵시디언 내 블로그 포스트 폴더 경로
	exportPath: string;         // 전처리된 .md 파일을 내보낼 폴더 경로
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
		enableMathLineBreak: boolean;    // 수식 줄바꿈 활성화 여부
		enableMathPipe: boolean;        // 수식 내 파이프(|)를 \mid로 변환
		enableMatrixLineBreak: boolean; // matrix 환경에서 줄바꿈(\\)을 \\\로 변환
		enableCalloutAutoTitle: boolean;  // 콜아웃 빈 제목을 type으로 채우기
		enableInlineToDisplay: boolean;  // 인라인 수식을 디스플레이 수식으로 변환
		enableListMathEscape: boolean;  // 리스트 항목 뒤의 수식 이스케이프 처리
		enableLowercaseCodeLang: boolean;  // 코드 블록 언어 소문자 변환
		enableCalloutCodeBlockEscape: boolean;  // 콜아웃 내 코드 블록 이스케이프 처리
		enableTabToSpaces: boolean;     // 탭을 공백으로 변환
		tabSize: number;                // 탭 크기 (공백 개수)
		enableAutoHyperlink: boolean;  // URL 자동 하이퍼링크 변환
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
			deleteConfirmation: boolean; // 삭제 전 확인 여부
			deleteCommitTemplate: string; // 삭제 시 커밋 메시지 템플릿
	};
}

export const DEFAULT_SETTINGS: Settings = {
	language: 'en', 
	blogPostPath: '',
	exportPath: '',
	openAIKey: '',
	blogUrl: '',
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
		enableMathLineBreak: true,
		enableMathPipe: true,
		enableMatrixLineBreak: true,
		enableCalloutAutoTitle: true,
		enableInlineToDisplay: false,
		enableListMathEscape: true,
		enableLowercaseCodeLang: true,
		enableCalloutCodeBlockEscape: true,
		enableTabToSpaces: true,
		tabSize: 4,
		enableAutoHyperlink: true,
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
		imagePath: 'assets/img',
		deleteConfirmation: true,
		deleteCommitTemplate: 'docs: delete post - {filename}'
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

		const text = getText(this.plugin.settings.language).settings;

		new Setting(containerEl)
			.setName(text.sections.required)
			.setHeading();

		new Setting(containerEl)
			.setName(text.language.name)
			.setDesc(text.language.desc)
			.addDropdown(dropdown => dropdown
				.addOption('en', 'English')
				.addOption('ko', '한국어')
				.addOption('zh', '中文')
				.addOption('ja', '日本語')
				.addOption('es', 'Español')
				.addOption('de', 'Deutsch')
				.addOption('ru', 'Русский')  // 러시아어 옵션 추가
				.setValue(this.plugin.settings.language)
				.onChange(async (value: 'en' | 'ko' | 'zh' | 'ja' | 'es' | 'de' | 'ru') => {  // 타입 수정
					this.plugin.settings.language = value;
					await this.plugin.saveSettings();
					this.display();
				}));

		new Setting(containerEl)
			.setName(text.blogPostPath.name)
			.setDesc(text.blogPostPath.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.blogPostPath.placeholder)
				.setValue(this.plugin.settings.blogPostPath)
				.onChange(async (value) => {
					this.plugin.settings.blogPostPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.exportPath.name)
			.setDesc(text.exportPath.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.exportPath.placeholder)
				.setValue(this.plugin.settings.exportPath)
				.onChange(async (value) => {
					this.plugin.settings.exportPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.openAIKey.name)
			.setDesc(text.openAIKey.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.openAIKey.placeholder)
				.setValue(this.plugin.settings.openAIKey)
				.onChange(async (value) => {
					this.plugin.settings.openAIKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.blogUrl.name)
			.setDesc(text.blogUrl.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.blogUrl.placeholder)
				.setValue(this.plugin.settings.blogUrl)
				.onChange(async (value) => {
					this.plugin.settings.blogUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl).setName(text.sections.preprocessing).setHeading();

		new Setting(containerEl)
			.setName(text.preprocessing.autoTagging.name)
			.setDesc(text.preprocessing.autoTagging.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableAutoTagging)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableAutoTagging = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.callout.name)
			.setDesc(text.preprocessing.callout.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableCallout)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableCallout = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.calloutTitleSeparator.name)
			.setDesc(text.preprocessing.calloutTitleSeparator.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.preprocessing.calloutTitleSeparator.placeholder)
				.setValue(this.plugin.settings.preprocessingOptions.calloutTitleSeparator)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.calloutTitleSeparator = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.calloutAutoTitle.name)
			.setDesc(text.preprocessing.calloutAutoTitle.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableCalloutAutoTitle)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableCalloutAutoTitle = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.highlight.name)
			.setDesc(text.preprocessing.highlight.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableHighlight)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableHighlight = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.highlightSeparator.name)
			.setDesc(text.preprocessing.highlightSeparator.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.preprocessing.highlightSeparator.placeholder)
				.setValue(this.plugin.settings.preprocessingOptions.highlightSeparator)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.highlightSeparator = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.docLink.name)
			.setDesc(text.preprocessing.docLink.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableDocLink)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableDocLink = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.docRef.name)
			.setDesc(text.preprocessing.docRef.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableDocRef)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableDocRef = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.image.name)
			.setDesc(text.preprocessing.image.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableImage)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableImage = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.imagePosition.name)
			.setDesc(text.preprocessing.imagePosition.desc)
			.addDropdown(dropdown => dropdown
				.addOption('normal', 'Default')
				.addOption('left', 'Left')
				.addOption('right', 'Right')
				.setValue(this.plugin.settings.preprocessingOptions.imagePosition)
				.onChange(async (value: 'normal' | 'left' | 'right') => {
					this.plugin.settings.preprocessingOptions.imagePosition = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.imageShadow.name)
			.setDesc(text.preprocessing.imageShadow.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.imageShadow)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.imageShadow = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.rawTag.name)
			.setDesc(text.preprocessing.rawTag.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableRawTag)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableRawTag = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.mathNotation.name)
			.setDesc(text.preprocessing.mathNotation.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableMathNotation)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableMathNotation = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.mathLineBreak.name)
			.setDesc(text.preprocessing.mathLineBreak.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableMathLineBreak)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableMathLineBreak = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.mathPipe.name)
			.setDesc(text.preprocessing.mathPipe.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableMathPipe)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableMathPipe = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.matrixLineBreak.name)
			.setDesc(text.preprocessing.matrixLineBreak.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableMatrixLineBreak)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableMatrixLineBreak = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.inlineToDisplay.name)
			.setDesc(text.preprocessing.inlineToDisplay.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableInlineToDisplay)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableInlineToDisplay = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.listMathEscape.name)
			.setDesc(text.preprocessing.listMathEscape.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableListMathEscape)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableListMathEscape = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.lowercaseCodeLang.name)
			.setDesc(text.preprocessing.lowercaseCodeLang.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableLowercaseCodeLang)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableLowercaseCodeLang = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.calloutCodeBlockEscape.name)
			.setDesc(text.preprocessing.calloutCodeBlockEscape.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableCalloutCodeBlockEscape)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableCalloutCodeBlockEscape = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.tabToSpaces.name)
			.setDesc(text.preprocessing.tabToSpaces.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableTabToSpaces)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableTabToSpaces = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.tabSize.name)
			.setDesc(text.preprocessing.tabSize.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.preprocessing.tabSize.placeholder)
				.setValue(String(this.plugin.settings.preprocessingOptions.tabSize ?? 4))
				.onChange(async (value) => {
					const parsed = parseInt(value);
					if (!isNaN(parsed) && parsed > 0) {
						this.plugin.settings.preprocessingOptions.tabSize = parsed;
						await this.plugin.saveSettings();
					} else {
						new Notice(text.preprocessing.tabSize.notice);
					}
				}));

		new Setting(containerEl)
			.setName(text.preprocessing.autoHyperlink.name)
			.setDesc(text.preprocessing.autoHyperlink.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.preprocessingOptions.enableAutoHyperlink)
				.onChange(async (value) => {
					this.plugin.settings.preprocessingOptions.enableAutoHyperlink = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl).setName(text.sections.git).setHeading();

		new Setting(containerEl)
			.setName(text.git.enable.name)
			.setDesc(text.git.enable.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.gitConfig.enabled)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.enabled = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.owner.name)
			.setDesc(text.git.owner.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.git.owner.placeholder)
				.setValue(this.plugin.settings.gitConfig.owner)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.owner = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.repo.name)
			.setDesc(text.git.repo.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.git.repo.placeholder)
				.setValue(this.plugin.settings.gitConfig.repo)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.repo = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.branch.name)
			.setDesc(text.git.branch.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.git.branch.placeholder)
				.setValue(this.plugin.settings.gitConfig.branch)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.branch = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.token.name)
			.setDesc(text.git.token.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.git.token.placeholder)
				.setValue(this.plugin.settings.gitConfig.token)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.token = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.uploadPostPath.name)
			.setDesc(text.git.uploadPostPath.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.git.uploadPostPath.placeholder)
				.setValue(this.plugin.settings.gitConfig.uploadPostPath)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.uploadPostPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.uploadImagePath.name)
			.setDesc(text.git.uploadImagePath.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.git.uploadImagePath.placeholder)
				.setValue(this.plugin.settings.gitConfig.uploadImagePath)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.uploadImagePath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.commitMessageTemplate.name)
			.setDesc(text.git.commitMessageTemplate.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.git.commitMessageTemplate.placeholder)
				.setValue(this.plugin.settings.gitConfig.commitMessageTemplate)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.commitMessageTemplate = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.imagePath.name)
			.setDesc(text.git.imagePath.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.git.imagePath.placeholder)
				.setValue(this.plugin.settings.gitConfig.imagePath)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.imagePath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.deleteConfirmation.name)
			.setDesc(text.git.deleteConfirmation.desc)
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.gitConfig.deleteConfirmation)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.deleteConfirmation = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName(text.git.deleteCommitTemplate.name)
			.setDesc(text.git.deleteCommitTemplate.desc)
			.addText(textComponent => textComponent
				.setPlaceholder(text.git.deleteCommitTemplate.placeholder)
				.setValue(this.plugin.settings.gitConfig.deleteCommitTemplate)
				.onChange(async (value) => {
					this.plugin.settings.gitConfig.deleteCommitTemplate = value;
					await this.plugin.saveSettings();
				}));
	}
}