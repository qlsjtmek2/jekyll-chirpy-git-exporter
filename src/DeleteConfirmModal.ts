import { Modal, App } from 'obsidian';
import { getText } from './ReferenceText';
import MyPlugin from './main';

export class DeleteConfirmModal extends Modal {
	private result: boolean = false;
	private plugin: MyPlugin;

	constructor(app: App, private fileName: string, plugin: MyPlugin) {
		super(app);

		this.plugin = plugin;
	}

	onOpen() {
		const {contentEl} = this;
		const text = getText(this.plugin.settings.language).modal.deleteConfirm;  // 또는 'en'을 사용

		contentEl.createEl('h2', {text: text.title});
		contentEl.createEl('p', {text: text.message(this.fileName)});

		const buttonContainer = contentEl.createDiv({cls: 'modal-button-container'});
		
		buttonContainer.createEl('button', {text: text.cancel}).onclick = () => {
			this.result = false;
			this.close();
		};

		const confirmButton = buttonContainer.createEl('button', {
			text: text.delete,
			cls: 'mod-warning'
		});
		confirmButton.onclick = () => {
			this.result = true;
			this.close();
		};
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}

	async waitForResult(): Promise<boolean> {
		return new Promise((resolve) => {
			this.onClose = () => {
				const {contentEl} = this;
				contentEl.empty();
				resolve(this.result);
			};
		});
	}
}