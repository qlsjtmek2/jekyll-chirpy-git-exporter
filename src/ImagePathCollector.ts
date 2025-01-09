export interface ImagePathPair {
    localPath: string;    // 옵시디언 내의 실제 이미지 경로
    uploadPath: string;   // Git에 업로드될 경로
    path: string;        // 파일 이름만 포함된 경로
}

export class ImagePathCollector {
    private imagePaths: Set<ImagePathPair> = new Set();

    addImage(localPath: string, uploadPath: string) {
        const path = localPath.split('/').pop() || localPath;  // 파일명 추출
        // console.log(`Adding image - Local: ${localPath}, Upload: ${uploadPath}`);
        this.imagePaths.add({ localPath, uploadPath, path });
        // console.log(`Current image count: ${this.imagePaths.size}`);
    }

    getImages(): ImagePathPair[] {
        const images = Array.from(this.imagePaths);
        console.log(`Getting ${images.length} collected images`);
        images.forEach(img => {
            // console.log(`- Local: ${img.localPath}, Upload: ${img.uploadPath}`);
        });
        return images;
    }

    clear() {
        const count = this.imagePaths.size;
        this.imagePaths.clear();
        // console.log(`Cleared ${count} images from collector`);
    }
} 