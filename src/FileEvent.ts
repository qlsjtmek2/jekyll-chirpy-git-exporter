import { TFile } from 'obsidian';

export type FileEventType = 'create' | 'delete' | 'modify' | 'rename';

export interface FileEvent {
	type: FileEventType;
	file: TFile;
	info?: string;
}

export function isFileEventEqual(a: FileEvent, b: FileEvent): boolean {
	return a.type == b.type && a.file == b.file;
}