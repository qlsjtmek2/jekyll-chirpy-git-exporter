import { Post, PostMetadata } from "./Post";
import OpenAI from "openai";
import { unixToDateWithTime } from "./Utils";

/**
 * PostMetadataGenerator 인터페이스:
 * - 구현체는 post(파일 정보)를 입력받아 PostMetadata를 생성해야 함
 */
export interface PostMetadataGenerator {
  generate(post: Post): Promise<PostMetadata>;
}

/**
 * ChirpyPostMetadataGenerator:
 * - Chirpy 블로그 테마에 맞게 Jekyll 프론트매터를 생성
 * - title / date / categories / tags / math / toc / comments 설정
 */
export class ChirpyPostMetadataGenerator implements PostMetadataGenerator {
  private openai: OpenAI;
  private isTagging: boolean;

  /**
   * blogBasePath(예: "blog/posts"):
   * - 카테고리 추출 시 이 경로를 제외하고 가져옴.
   * - 사용 예: "blog/posts/IT/알고리즘/myfile.md" -> ["IT", "알고리즘"]
   */
  private blogBasePath: string;

  constructor(
    openAiApiKey: string,
    isTagging: boolean = true,
    blogBasePath: string = "blog/posts"
  ) {
    this.openai = new OpenAI({
      apiKey: openAiApiKey,
      dangerouslyAllowBrowser: true,
    });
    this.isTagging = isTagging;
    this.blogBasePath = blogBasePath;
  }

  /**
   * generate(post: Post):
   * - title: post.getTitle()
   * - date: post.getCreationDate() (YYYY-MM-DD HH:MM:SS +/-TTTT 형식)
   * - categories: 경로에서 추출 (blogBasePath 제외)
   * - tags: OpenAI API로부터 생성 (옵션)
   * - math, toc, comments: true
   */
  public async generate(post: Post): Promise<PostMetadata> {
    const title = post.getTitle();

    // date를 YYYY-MM-DD HH.MM.SS +/-TTTT 형태로 변환
    const dateString = unixToDateWithTime(post.getFile().stat.ctime);

    // 파일 경로에서 디렉터리만 추출하여 categories 생성
    // blogBasePath가 있다면, 해당 부분을 제외
    const categories = this.extractCategoriesFromPath(post.getFile().path);

    // console.log("File path: ", post.getFile().path);

    // isTagging이 true일 때만 태그 생성
    const tags = this.isTagging
      ? await this.generateTagsFromContent(post.getContent())
      : [];

    // Chirpy용 PostMetadata 구성
    const metadata: PostMetadata = {
      title: title,
      date: dateString,
      categories: categories,
      tags: tags,
      math: true,
      toc: true,
      comments: true,
    };

    return metadata;
  }

  /**
   * extractCategoriesFromPath:
   * - blogBasePath = "blog/posts"인 경우, 해당 경로를 제거하고
   *   나머지를 슬래시(/)로 분리한 뒤, 파일명은 제외
   *
   * 예: "blog/posts/IT/알고리즘/my-file.md" 
   *    -> blogBasePath 제거 후: "/IT/알고리즘/my-file.md"
   *    -> 파일명(my-file.md) 제거 후: ["IT", "알고리즘"]
   */
  private extractCategoriesFromPath(filePath: string): string[] {
    // 1) blogBasePath 제거
    if (filePath.startsWith(this.blogBasePath)) {
      filePath = filePath.substring(this.blogBasePath.length);
    }

    // 2) 만약 선행 슬래시가 있다면 제거
    if (filePath.startsWith("/")) {
      filePath = filePath.substring(1);
    }

    // 3) 슬래시(/)로 분리
    const parts = filePath.split("/");

    // 4) 맨 마지막(파일명)을 제거
    parts.pop(); // "my-file.md" 등
    // 필요하다면 확장자 제거도 가능
    // e.g. fileName.replace(/\.[^/.]+$/, "");

    return parts;
  }

  /**
   * generateTagsFromContent:
   * - 파일 본문 내용을 OpenAI에 전달하여, 적절한 태그 목록을 추출하는 예시
   */
  private async generateTagsFromContent(content: string): Promise<string[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `다음 글을 분석하여 핵심 키워드(태그) 5 ~ 8개를 추출해 주세요.\n\n글:\n${content}\n\n출력 형식: 키워드만 콤마로 구분, 불필요한 말 없이.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content?.trim() || "";
      const tags = text
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // console.log("생성된 태그:", tags);
      return tags;
    } catch (error) {
      console.error("OpenAI API 호출 중 오류 발생:", error);
      return [];
    }
  }
}
