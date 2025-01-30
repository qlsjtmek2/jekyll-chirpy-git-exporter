import { TFile, App, parseYaml } from 'obsidian';
import { Post, PostMetadata } from './Post';

export class PostConvertor {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    async convert(file: TFile): Promise<Post> {
        // 파일 내용 읽기
        const content = await this.app.vault.read(file);

        // YAML 프론트매터와 내용 분리
        const { metadata, bodyContent } = this.parseMarkdown(content);

        return new Post(
            file.basename,
            metadata,
            bodyContent,
            file
        );
    }

    private parseMarkdown(content: string): { metadata: PostMetadata, bodyContent: string } {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const matches = content.match(frontMatterRegex);

        if (!matches) {
            // 프론트매터가 없는 경우 기본값 사용
            return {
                metadata: {
                    title: this.generateDefaultTitle(content),
                    date: new Date().toISOString(),
                    // 필요한 다른 기본 메타데이터 추가
                },
                bodyContent: content.trim()
            };
        }

        const [_, yamlContent, bodyContent] = matches;
        const metadata = parseYaml(yamlContent) as PostMetadata;

        if (!metadata.title) {
            metadata.title = this.generateDefaultTitle(bodyContent);
        }

        return {
            metadata,
            bodyContent: bodyContent.trim()
        };
    }

    // 기본 제목 생성을 위한 헬퍼 메서드
    private generateDefaultTitle(content: string): string {
        // 첫 번째 줄에서 # 제목이 있는지 확인
        const headingMatch = content.match(/^#\s+(.+)$/m);
        if (headingMatch) {
            return headingMatch[1].trim();
        }

        // 첫 번째 비어있지 않은 줄을 사용
        const firstLine = content.split('\n').find(line => line.trim().length > 0);
        if (firstLine) {
            // 긴 줄인 경우 적절히 자르기
            return firstLine.trim().slice(0, 50) + (firstLine.length > 50 ? '...' : '');
        }

        // 아무것도 없는 경우 기본값
        return 'Untitled';
    }
}
