import { Post } from "./Post";
import { normalizePath, TFile, Vault } from 'obsidian';

export interface PostExporter {
    export(post: Post, exportPath: string, exportFileName: string): Promise<void>;
}

export class ChirpyPostExporter implements PostExporter {
    private vault: Vault;

    constructor(vault: Vault) {
        this.vault = vault;
    }

    /**
     * Obsidian의 상대 경로를 Vault 내의 경로로 변환
     * @param relativePath Vault 내의 상대 경로
     * @returns Vault 내의 전체 경로
     */
    private getVaultPath(relativePath: string): string {
        return normalizePath(relativePath);
    }

    async export(post: Post, exportPath: string, exportFileName: string): Promise<void> {
        try {
            // Vault 내의 전체 경로 생성
            const vaultPath = this.getVaultPath(exportPath);
            const fullPath = normalizePath(`${vaultPath}/${exportFileName}`);

            // 파일 존재 여부 확인
            let file: TFile;
            const existingFile = this.vault.getAbstractFileByPath(fullPath);
            if (existingFile instanceof TFile) {
                file = existingFile;
                // 파일 수정
                await this.vault.modify(file, post.toString());
                // console.log(`Post updated successfully at ${fullPath}`);
            } else {
                // 파일 생성
                file = await this.vault.create(fullPath, post.toString());
                // console.log(`Post exported successfully to ${fullPath}`);
            }
        } catch (error) {
            console.error(`Failed to export post: ${error}`);
            throw new Error(`Failed to export post: ${error}`);
        }
    }
}
