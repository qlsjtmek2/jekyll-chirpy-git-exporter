import { Modal, App } from 'obsidian';

export class DeleteConfirmModal extends Modal {
	private result: boolean = false;

	constructor(app: App, private fileName: string) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.createEl('h2', {text: '게시물 삭제 확인'});
		contentEl.createEl('p', {text: `"${this.fileName}" 게시물을 Git에서 삭제하시겠습니까?`});

		const buttonContainer = contentEl.createDiv({cls: 'modal-button-container'});
		
		buttonContainer.createEl('button', {text: '취소'}).onclick = () => {
			this.result = false;
			this.close();
		};

		const confirmButton = buttonContainer.createEl('button', {
			text: '삭제',
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