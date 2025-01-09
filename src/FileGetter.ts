import { TFile, App } from "obsidian";
import { PostRenamer } from "./PostRenamer";
import { PostMetadata } from "./Post";
import { unixToDate } from './Utils'

export interface FileGetter<T> {
    get(sourceFile: T): TFile | null;
}

// 옵시디언 파일을 통해 Export Path 경로 내의 파일을 얻어냅니다.
export class ObsidianToExportFileGetter implements FileGetter<TFile> {
    private app: App;
    private exportPath: string;
    private postRenamer: PostRenamer;

    constructor(app: App, exportPath: string, postRenamer: PostRenamer) {
        this.app = app;
        this.exportPath = exportPath;
        this.postRenamer = postRenamer;
    }

    get(sourceFile: TFile): TFile | null {
        const oldTitle = sourceFile.basename;
        const metadata = { title: oldTitle, date: unixToDate(sourceFile.stat.ctime) };
        const expectedFileName = this.postRenamer.rename(oldTitle, metadata);

        // exportPath 내에서 해당 파일명을 가진 파일 찾기
        const exportFile = this.app.vault.getAbstractFileByPath(`${this.exportPath}/${expectedFileName}`);

        return exportFile instanceof TFile ? exportFile : null;
    }
}

// OldPath를 통해 ExportPath 내의 파일을 얻어냅니다.
export class OldPathToExportFileGetter implements FileGetter<string> {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    get(oldPath: string): TFile | null {
        return this.app.vault.getFileByPath(oldPath);
    }
}
