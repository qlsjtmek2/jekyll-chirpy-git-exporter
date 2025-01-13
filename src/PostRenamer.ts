import { PostMetadata } from "./Post";

export interface PostRenamer {
    rename(oldTitle: string, metadata: PostMetadata): string;
}

// Post의 TFile 이름을 Date-Title.md 형식으로 변경합니다.
export class ChirpyFilenameFormatter implements PostRenamer {
    rename(oldTitle: string, metadata: PostMetadata): string {
        const date = metadata.date.split(' ')[0];
        const title = metadata.title
            .replace(/[^\w\s\-가-힣ㄱ-ㅎㅏ-ㅣ]/g, '')
            .replace(/\s+/g, '-');
        const newFileName = `${date}-${title}.md`;
        return newFileName;
    }
}