import { Octokit } from '@octokit/rest';
import { Vault, TFile, Notice } from 'obsidian';
import { ImagePathPair } from './ImagePathCollector';
import { PostRenamer, ChirpyFilenameFormatter } from './PostRenamer';
import { unixToDate } from './Utils';

export interface GitConfig {
    enabled: boolean;
    owner: string;
    repo: string;
    branch: string;
    token: string;
    uploadPostPath: string;
    uploadImagePath: string;
    commitMessageTemplate: string;
    imagePath: string;
    deleteCommitTemplate: string;
    deleteConfirmation: boolean;
}

export class GitUploader {
    private octokit: Octokit;
    private config: GitConfig;
    private vault: Vault;
    private postRenamer: PostRenamer;

    constructor(config: GitConfig, vault: Vault) {
        this.config = config;
        this.vault = vault;
        this.octokit = new Octokit({
            auth: config.token
        });
        this.postRenamer = new ChirpyFilenameFormatter();
    }

    async uploadFile(path: string, content: string) {
        try {
            // 기존 파일 정보 먼저 확인
            let existingFile;
            try {
                const response = await this.octokit.rest.repos.getContent({
                    owner: this.config.owner,
                    repo: this.config.repo,
                    path: `_posts/${path}`,
                });
                
                if (!Array.isArray(response.data)) {
                    existingFile = response.data;
                }
            } catch (error) {
                // 파일이 없는 경우 무시
                console.error(`File does not exist yet: _posts/${path}`);
            }

            // 파일 업로드
            await this.octokit.rest.repos.createOrUpdateFileContents({
                owner: this.config.owner,
                repo: this.config.repo,
                path: `_posts/${path}`,
                message: this.generateCommitMessage(path),
                content: Buffer.from(content).toString('base64'),
                sha: existingFile?.sha, // 기존 파일이 있는 경우 SHA 포함
            });

            // console.log(`Successfully uploaded file: _posts/${path}`);
        } catch (error) {
            console.error(`Failed to upload file ${path}:`, error);
            throw error;
        }
    }

    async uploadImages(images: { path: string; content: Buffer }[]) {
        try {
            // 현재 브랜치의 최신 커밋 정보 가져오기
            const ref = await this.octokit.rest.git.getRef({
                owner: this.config.owner,
                repo: this.config.repo,
                ref: `heads/${this.config.branch}`,
            });

            // 원격 브랜치의 최신 커밋 가져오기
            const latestCommit = await this.octokit.rest.git.getCommit({
                owner: this.config.owner,
                repo: this.config.repo,
                commit_sha: ref.data.object.sha,
            });

            // 각 이미지에 대한 blob 생성
            const blobs = await Promise.all(
                images.map(async image => {
                    if (!image.path) {
                        console.error('Image path is undefined');
                        return null;
                    }
                    return this.octokit.rest.git.createBlob({
                        owner: this.config.owner,
                        repo: this.config.repo,
                        content: image.content.toString('base64'),
                        encoding: 'base64',
                    });
                })
            );

            // 유효한 blob만 필터링
            const validBlobs = blobs.filter(blob => blob !== null);

            // 트리 생성
            const tree = await this.octokit.rest.git.createTree({
                owner: this.config.owner,
                repo: this.config.repo,
                base_tree: latestCommit.data.tree.sha,
                tree: images.map((image, index) => ({
                    path: `${this.config.uploadImagePath}/${image.path}`,
                    mode: '100644',
                    type: 'blob',
                    sha: validBlobs[index].data.sha,
                })),
            });

            // 새로운 커밋 생성
            const newCommit = await this.octokit.rest.git.createCommit({
                owner: this.config.owner,
                repo: this.config.repo,
                message: `docs: upload ${images.length} images`,
                tree: tree.data.sha,
                parents: [ref.data.object.sha],
            });

            // 브랜치 참조 업데이트
            await this.octokit.rest.git.updateRef({
                owner: this.config.owner,
                repo: this.config.repo,
                ref: `heads/${this.config.branch}`,
                sha: newCommit.data.sha,
                force: true
            });

            // console.log(`Successfully uploaded ${images.length} images in a single commit`);
        } catch (error) {
            console.error('Failed to upload images:', error);
            throw error;
        }
    }

    private generateCommitMessage(path: string): string {
        const template = this.config.commitMessageTemplate || 'Update {{filename}}';
        return template.replace('{{filename}}', path);
    }

    async uploadFiles(files: { path: string; content: string; encoding: string }[], commitMessage: string) {
        try {
            // 현재 브랜치의 최신 커밋 정보 가져오기
            const ref = await this.octokit.rest.git.getRef({
                owner: this.config.owner,
                repo: this.config.repo,
                ref: `heads/${this.config.branch}`,
            });

            // 원격 브랜치의 최신 커밋 가져오기
            const latestCommit = await this.octokit.rest.git.getCommit({
                owner: this.config.owner,
                repo: this.config.repo,
                commit_sha: ref.data.object.sha,
            });

            // 각 파일에 대한 blob 생성
            const blobs = await Promise.all(
                files.map(file => 
                    this.octokit.rest.git.createBlob({
                        owner: this.config.owner,
                        repo: this.config.repo,
                        content: file.content,
                        encoding: file.encoding,
                    })
                )
            );

            // 트리 생성
            const tree = await this.octokit.rest.git.createTree({
                owner: this.config.owner,
                repo: this.config.repo,
                base_tree: latestCommit.data.tree.sha,
                tree: files.map((file, index) => ({
                    path: file.path,
                    mode: '100644',
                    type: 'blob',
                    sha: blobs[index].data.sha,
                })),
            });

            // 새로운 커밋 생성
            const newCommit = await this.octokit.rest.git.createCommit({
                owner: this.config.owner,
                repo: this.config.repo,
                message: commitMessage,
                tree: tree.data.sha,
                parents: [ref.data.object.sha], // 최신 커밋을 부모로 사용
            });

            try {
                // 브랜치 참조 업데이트 시도
                await this.octokit.rest.git.updateRef({
                    owner: this.config.owner,
                    repo: this.config.repo,
                    ref: `heads/${this.config.branch}`,
                    sha: newCommit.data.sha,
                    force: true // force 옵션 추가
                });
            } catch (updateError) {
                console.error('Failed to update ref:', updateError);
                throw updateError;
            }

            // console.log(`Successfully uploaded ${files.length} files in a single commit`);
        } catch (error) {
            console.error('Failed to upload files:', error);
            throw error;
        }
    }

    async uploadPost(path: string, content: string, images: ImagePathPair[]) {
        try {
            const files: { path: string; content: string; encoding: string }[] = [];
            
            // 포스트 파일 추가
            files.push({
                path: `_posts/${path}`,
                content: content,
                encoding: 'utf-8'
            });

            // 이미지 파일들 추가
            for (const image of images) {
                try {
                    // 이미지 파일 찾기 시도
                    const imageFile = this.vault.getAbstractFileByPath(image.localPath);
                    
                    if (!(imageFile instanceof TFile)) {
                        console.error(`Image file not found: ${image.localPath}`);
                        continue;
                    }

                    const imageData = await this.vault.readBinary(imageFile);
                    if (!imageData) {
                        console.error(`Failed to read image: ${image.localPath}`);
                        continue;
                    }

                    files.push({
                        path: image.uploadPath,
                        content: Buffer.from(imageData).toString('base64'),
                        encoding: 'base64'
                    });
                } catch (imageError) {
                    console.error(`Error processing image ${image.localPath}:`, imageError);
                    continue;
                }
            }

            // 모든 파일을 하나의 커밋으로 업로드
            if (files.length > 0) {
                await this.uploadFiles(files, this.generateCommitMessage(path));
            }

        } catch (error) {
            console.error('Failed to upload post and images:', error);
            throw error;
        }
    }

    async deletePosts(paths: string[]) {
        let deletedCount = 0;  // 삭제된 파일 수를 추적하기 위한 변수 추가
        try {
            for (const fileName of paths) {
                const filePath = `${this.config.uploadPostPath}/${fileName}`;
                
                // 파일 존재 여부 확인
                let fileToDelete;
                try {
                    const response = await this.octokit.rest.repos.getContent({
                        owner: this.config.owner,
                        repo: this.config.repo,
                        path: filePath,
                    });
                    
                    if (!Array.isArray(response.data)) {
                        fileToDelete = response.data;
                    }
                } catch (error) {
                    new Notice(`원격 저장소에 파일이 없습니다: ${filePath}`);
                    continue;
                }

                if (fileToDelete) {
                    await this.octokit.rest.repos.deleteFile({
                        owner: this.config.owner,
                        repo: this.config.repo,
                        path: filePath,
                        message: this.config.deleteCommitTemplate.replace('{filename}', fileName),
                        sha: fileToDelete.sha,
                        branch: this.config.branch
                    });
                    deletedCount++;  // 파일 삭제 성공시 카운트 증가
                }
            }
        } catch (error) {
            console.error('게시물 삭제 실패:', error);
            throw error;
        }

        new Notice(`Git 저장소에서 ${deletedCount}개의 게시물이 삭제되었습니다.`);
    }

    // 기존 deletePost 메서드를 deletePosts를 사용하도록 수정
    async deletePost(path: string) {
        await this.deletePosts([path]);
    }
}
