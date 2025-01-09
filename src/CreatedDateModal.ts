import { Modal, App, TFile } from 'obsidian';
import moment from 'moment';

// 날짜 선택 모달 클래스 추가
export class CreatedDateModal extends Modal {
	private date: moment.Moment;
	private readonly file: TFile;
	private readonly onSubmit: (date: moment.Moment) => void;

	constructor(app: App, file: TFile, onSubmit: (date: moment.Moment) => void) {
		super(app);
		this.file = file;
		this.onSubmit = onSubmit;
		this.date = window.moment(file.stat.ctime);
	}

	onOpen() {
		const {contentEl} = this;
		
		contentEl.createEl('h2', {text: '생성 날짜 수정'});
		
		// 날짜 입력 필드
		const dateInput = contentEl.createEl('input', {
			type: 'date',
			value: this.date.format('YYYY-MM-DD')
		});

		// 확인 버튼
		const submitButton = contentEl.createEl('button', {
			text: '확인',
			cls: 'mod-cta'
		});
		
		// 취소 버튼
		const cancelButton = contentEl.createEl('button', {
			text: '취소'
		});

		// 버튼 컨테이너 스타일링
		const buttonContainer = contentEl.createEl('div');
		buttonContainer.style.marginTop = '1rem';
		buttonContainer.style.display = 'flex';
		buttonContainer.style.gap = '0.5rem';
		buttonContainer.appendChild(submitButton);
		buttonContainer.appendChild(cancelButton);

		// 이벤트 리스너
		dateInput.addEventListener('change', (e) => {
			const target = e.target as HTMLInputElement;
			this.date = window.moment(target.value);
		});

		submitButton.addEventListener('click', () => {
			this.onSubmit(this.date);
			this.close();
		});

		cancelButton.addEventListener('click', () => {
			this.close();
		});
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}