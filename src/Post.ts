import { TFile } from "obsidian";

export interface PostMetadata {
    title: string;
    date: string;
    tags?: string[];
    categories?: string[];
    published?: boolean;
    [key: string]: any; // 기타 추가 속성들을 위한 인덱스 시그니처
}

export class Post {
    private title: string;
    private metadata: PostMetadata;
    private content: string;
    private file: TFile;

    constructor(title: string, metadata: PostMetadata, content: string, file: TFile) {
        this.title = title;
        this.metadata = metadata;
        this.content = content;
        this.file = file;
    }

    // Getters
    getTitle(): string {
        return this.title;
    }

    getMetadata(): PostMetadata {
        return this.metadata;
    }

    getContent(): string {
        return this.content;
    }

    getFile(): TFile {
        return this.file;
    }

    // Setters
    setTitle(title: string): void {
        this.title = title;
    }

    setMetadata(metadata: PostMetadata): void {
        this.metadata = metadata;
    }

    setContent(content: string): void {
        this.content = content;
    }

    // 포스트를 문자열로 변환 (마크다운 형식)
    toString(): string {
        const formatValue = (value: any): string => {
            if (Array.isArray(value)) {
                return `[${value.map(v => `"${v}"`).join(', ')}]`;
            }
            if (typeof value === 'string') {
                return `"${value}"`;
            }
            return `${value}`;
        };

        const metadataYaml = '---\n' + 
            Object.entries(this.metadata)
                .map(([key, value]) => `${key}: ${formatValue(value)}`)
                .join('\n') + 
            '\n---\n';
        
        return `${metadataYaml}\n${this.content}`;
    }
}
