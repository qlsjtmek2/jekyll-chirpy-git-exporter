import { Settings } from './settings';
import { ImagePathCollector } from './ImagePathCollector';

export interface Preprocessor {
    preprocess(content: string, options: Settings): string;
}

export class ChirpyPreprocessor implements Preprocessor {
    private imageCollector: ImagePathCollector;

    constructor(imageCollector: ImagePathCollector) {
        this.imageCollector = imageCollector;
    }

    preprocess(post: string, settings: Settings): string {
        const options = settings.preprocessingOptions;
        let processedPost = post;
    
        // 콜아웃 빈 제목 자동 처리
        if (options.enableCalloutAutoTitle) {
            processedPost = processedPost.replace(
                /^(?:\s*>)+\s*\[!(\w+)]\s*$/gm,
                match => {
                    const indentMatch = match.match(/^(?:\s*>)+\s*/);
                    const typeMatch = match.match(/\[!(\w+)]/);
                    
                    if (!indentMatch || !typeMatch) return match;
                    
                    const indentation = indentMatch[0];
                    const type = typeMatch[1];
                    return `${indentation}[!${type}] ${type}`;
                }
            );
            
            processedPost = processedPost.replace(
                /^(?:\s*>)+\s*\[!(\w+)]-\s*$/gm,
                match => {
                    const indentMatch = match.match(/^(?:\s*>)+\s*/);
                    const typeMatch = match.match(/\[!(\w+)]/);
                    
                    if (!indentMatch || !typeMatch) return match;
                    
                    const indentation = indentMatch[0];
                    const type = typeMatch[1];
                    return `${indentation}[!${type}]- ${type}`;
                }
            );
        }

        // 그 다음 일반 Callout 처리
        if (options.enableCallout) {
            // 접을 수 있는 콜아웃
            processedPost = processedPost.replace(
                /> \[!(\w+)]-\s+(.+)/g,
                `> [!$1]- $2${options.calloutTitleSeparator}`
            );

            // 일반 콜아웃
            processedPost = processedPost.replace(
                /> \[!(\w+)]\s+(.+)/g,
                `> [!$1] $2${options.calloutTitleSeparator}`
            );
        }

        // 하이라이트 전처리
        if (options.enableHighlight) {
            processedPost = processedPost.replace(
                /==(.*?)==/g,
                `${options.highlightSeparator}$1${options.highlightSeparator}`
            );
        }

        // 이미지 처리
        if (settings.preprocessingOptions.enableImage) {
            const imageExtensions = /\.(png|jpg|jpeg|gif|webp|svg)$/i;

            // 이미지 파일 경로 추출 및 수집 함수
            const processImagePath = (filename: string) => {
                if (imageExtensions.test(filename)) {
                    // 파일명에서 경로 구분자 처리
                    const cleanFilename = filename.split('/').pop() || filename;
                    
                    // 이미지 경로 수집
                    // 로컬 경로는 설정된 이미지 경로와 파일명을 조합
                    const localPath = `${settings.gitConfig.imagePath}/${cleanFilename}`;
                    const uploadPath = `${settings.gitConfig.uploadImagePath}/${cleanFilename}`;
                    
                    // console.log('Processing image:', {
                    //     original: filename,
                    //     localPath: localPath,
                    //     uploadPath: uploadPath
                    // });
                    
                    this.imageCollector.addImage(localPath, uploadPath);
                    
                    return {
                        filename: cleanFilename,
                        path: uploadPath
                    };
                }
                return null;
            };

            /**
             * (1) center + width x height
             * 예: ![[filename.png|center|300x200]]
             */
            processedPost = processedPost.replace(
                /!\[\[(.+?)(?:\|.+)?\|center\|(\d+)x(\d+)]]/g,
                (match, filename, width, height) => {
                    const imageInfo = processImagePath(filename);
                    if (imageInfo) {
                        return `![${imageInfo.filename}](/${imageInfo.path})${this.getImageAttributes(width, height, settings)}`;
                    }
                    return match;
                }
            );

            /**
             * (2) center + width
             * 예: ![[filename.png|center|300]]
             */
            processedPost = processedPost.replace(
                /!\[\[(.+?)(?:\|.+)?\|center\|(\d+)]]/g,
                (match, filename, width) => {
                    const imageInfo = processImagePath(filename);
                    if (imageInfo) {
                        return `![${imageInfo.filename}](/${imageInfo.path})${this.getImageAttributes(width, undefined, settings)}`;
                    }
                    return match;
                }
            );

            /**
             * (3) width x height
             * 예: ![[filename.png|300x200]]
             */
            processedPost = processedPost.replace(
                /!\[\[(.+?)(?:\|.+)?\|(\d+)x(\d+)]]/g,
                (match, filename, width, height) => {
                    const imageInfo = processImagePath(filename);
                    if (imageInfo) {
                        return `![${imageInfo.filename}](/${imageInfo.path})${this.getImageAttributes(width, height, settings)}`;
                    }
                    return match;
                }
            );

            /**
             * (4) width만
             * 예: ![[filename.png|300]]
             */
            processedPost = processedPost.replace(
                /!\[\[(.+?)(?:\|.+)?\|(\d+)]]/g,
                (match, filename, width) => {
                    const imageInfo = processImagePath(filename);
                    if (imageInfo) {
                        return `![${imageInfo.filename}](/${imageInfo.path})${this.getImageAttributes(width, undefined, settings)}`;
                    }
                    return match;
                }
            );

            /**
             * (5) center만
             * 예: ![[filename.png|center]]
             */
            processedPost = processedPost.replace(
                /!\[\[(.+?)\|center]]/g,
                (match, filename) => {
                    const imageInfo = processImagePath(filename);
                    if (imageInfo) {
                        return `![${imageInfo.filename}](/${imageInfo.path})${this.getImageAttributes(undefined, undefined, settings)}`;
                    }
                    return match;
                }
            );

            /**
             * (6) 기본 패턴 (옵션 전혀 없음)
             * 예: ![[filename.png]]
             */
            processedPost = processedPost.replace(
                /!\[\[(.+?)(?:\|.+)?]]/g,
                (match, filename) => {
                    const imageInfo = processImagePath(filename);
                    if (imageInfo) {
                        return `![${imageInfo.filename}](/${imageInfo.path})${this.getImageAttributes(undefined, undefined, settings)}`;
                    }
                    return match;
                }
            );
        }

        // 문서 참조 전처리 (이미지가 아닌 경우만)
        if (options.enableDocRef) {
            const imageExtensions = /\.(png|jpg|jpeg|gif|webp|svg)$/i;
            processedPost = processedPost.replace(
                /!\[\[(.+?)]]/g,
                (match, docName) => {
                    if (!imageExtensions.test(docName)) {
                        return `[${docName}](${settings.blogUrl}/${docName.replace(/[^가-힣a-zA-Z0-9\s]+/g, '').replace(/\s+/g, '-')})`;
                    }
                    return match;
                }
            );
        }

        // 문서 링크 전처리 (이미지 마크다운이 아닌 일반 [[링크]] 구문)
        if (options.enableDocLink) {
            processedPost = processedPost.replace(
                /\[\[(.+?)]]/g,
                (_, docName) => {
                    const cleanName = docName.replace(/[^가-힣a-zA-Z0-9\s]+/g, '').replace(/\s+/g, '-');
                    const encodedName = encodeURIComponent(cleanName);
                    return `[${docName}](${settings.blogUrl}/${encodedName})`;
                }
            );
        }

        // 수식 내 이중 중괄호 처리
        if (options.enableRawTag) {
            // 달러 기호로 둘러싸인 수식 찾기
            processedPost = processedPost.replace(/\$.*?\$/g, (match) => {
                // 수식 내의 이중 중괄호 패턴을 raw 태그로 변환
                return match.replace(/{{(.*?)}}/g, '{% raw %}{{$1}}{% endraw %}');
            });
            
            // 더블 달러 기호로 둘러싸인 수식 찾기
            processedPost = processedPost.replace(/\$\$.*?\$\$/g, (match) => {
                // 수식 내의 이중 중괄호 패턴을 raw 태그로 변환
                return match.replace(/{{(.*?)}}/g, '{% raw %}{{$1}}{% endraw %}');
            });
        }

        // 매트릭스 줄바꿈 처리 추가
        if (options.enableMatrixLineBreak) {
            // 매트릭스 줄바꿈 공백 처리
            processedPost = processedPost.replace(/matrix}(.*?)\\end{/gs, (match) => {
                // \\ 양옆에 공백 추가
                return match.replace(/(\S)\\\\(\S)/g, '$1 \\\\ $2');
            });
        }

        // 수식 표기법 전처리
        if (options.enableMathNotation) {
            // \sum^{A}_{B} -> \sum_{B}^{A} 변환
            processedPost = processedPost.replace(
                /\\(sum|int|prod|coprod|bigcup|bigcap|bigoplus|bigotimes|bigsqcup)\^{([^}]*)}\_{([^}]*)}/g,
                '\\$1_{$3}^{$2}'
            );

            // 단일 문자 케이스도 처리 (\sum^a_b -> \sum_b^a)
            processedPost = processedPost.replace(
                /\\(sum|int|prod|coprod|bigcup|bigcap|bigoplus|bigotimes|bigsqcup)\^([^\{])\_{([^}]*)}/g,
                '\\$1_{$3}^$2'
            );
            
            processedPost = processedPost.replace(
                /\\(sum|int|prod|coprod|bigcup|bigcap|bigoplus|bigotimes|bigsqcup)\^{([^}]*)}\_([^\{])/g,
                '\\$1_$3^{$2}'
            );
        }

        // 수식 내 밑줄 이스케이프 처리
        if (options.enableMathEscape) {
            // 인라인 수식 ($...$) 처리
            processedPost = processedPost.replace(/\$(.*?)\$/g, (match) => {
                return match.replace(/([}\)\]])(\_)/g, '$1\\$2');
            });

            // // 디스플레이 수식 ($$...$$) 처리
            // processedPost = processedPost.replace(/\$\$(.*?)\$\$/gs, (match) => {
            //     return match.replace(/([}\)\]])(\_)/g, '$1\\$2');
            // });
        }

        // 수식 줄바꿈 처리
        if (options.enableMathLineBreak) {
            // 연속된 수식 블록 분리 ($$$$를 $$\n$$ 로 변환)
            processedPost = processedPost.replace(/\$\$(.*?)\$\$\$\$(.*?)\$\$/gs, 
                (match, formula1, formula2) => {
                    return `$$${formula1}$$\n$$${formula2}$$`;
                }
            );

            // 수식 블록 앞뒤로 빈 줄 추가
            processedPost = processedPost.replace(/(^|\n)((?:>\s*)*)\$\$(.*?)\$\$/gms, (match, newline, prefix, content) => {
                const trimmed = content.trim();
                const quoteMark = prefix.trim() ? `${prefix.trim()} ` : '';
                
                return `${newline}${quoteMark}\n${quoteMark}$$\n${quoteMark}${trimmed}\n${quoteMark}$$\n${quoteMark}`;
            });
        }

        // 수식 내 파이프라인 변환
        if (options.enableMathPipe) {
            // 인라인 수식 ($...$) 처리
            processedPost = processedPost.replace(/\$(.*?)\$/g, (match) => {
                return match.replace(/\|/g, '\\mid');
            });

            // 디스플레이 수식 ($$...$$) 처리
            processedPost = processedPost.replace(/\$\$(.*?)\$\$/gs, (match) => {
                return match.replace(/\|/g, '\\mid');
            });
        }

        // 리스트 항목 뒤의 수식 이스케이프 처리
        if (options.enableListMathEscape) {
            processedPost = processedPost.replace(
                /^(\s*(?:[-*]|\d+\.)\s+)(\$.*?\$)$/gm,
                (match, list, math) => {
                    if (math.startsWith('$')) {
                        return `${list}\\${math}`;
                    }
                    return match;
                }
            );
        }

        // 수식 처리 부분에 추가
        if (options.enableInlineToDisplay) {
            // $$ $$ 는 건드리지 않고 $ $ 만 변환
            processedPost = processedPost.replace(
                /([^$]|^)\$([^$\n]+?[^$\n])\$([^$]|$)/g,
                (match, before, content, after) => {
                    // $$ 다음에 숫자가 오는 패턴은 무시
                    if (content.match(/^\d+$/)) {
                        return match;
                    }
                    // 캡처된 앞뒤 문자를 유지하면서 $ -> $$ 변환
                    return `${before}$$${content}$$${after}`;
                }
            );
        }

        return processedPost;
    }

    /**
     * 이미지 width, height, position, shadow 등의 속성을 문자열로 만들어 반환
     * @param width    (선택) 이미지 폭
     * @param height   (선택) 이미지 높이
     * @param settings Settings 객체
     */
    private getImageAttributes(width?: string, height?: string, settings?: Settings): string {
        if (!settings) {
            return '';
        }

        const attributes: string[] = [];
        const classes: string[] = [];

        // 너비, 높이 지정
        if (width) {
            attributes.push(`width="${width}"`);
        }
        if (height) {
            attributes.push(`height="${height}"`);
        }

        // imagePosition, imageShadow 지정
        const { imagePosition, imageShadow } = settings.preprocessingOptions;

        if (imagePosition !== 'normal') {
            classes.push(`.${imagePosition}`);
        }
        if (imageShadow) {
            classes.push('.shadow');
        }

        // 최종 Markdown 속성 문자열 생성
        // 예: {: width="300" height="200" .center .shadow}
        if (attributes.length > 0 || classes.length > 0) {
            const joinedAttributes = attributes.join(' ');
            const joinedClasses = classes.join(' ');

            if (joinedAttributes && joinedClasses) {
                return `{: ${joinedAttributes} ${joinedClasses}}`;
            } else if (joinedAttributes) {
                return `{: ${joinedAttributes}}`;
            } else {
                return `{: ${joinedClasses}}`;
            }
        }

        // 속성 / 클래스가 전혀 없으면 빈 문자열
        return '';
    }
}