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
    
        /***************************************************************************
        콜아웃 처리
        ***************************************************************************/

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

        /***************************************************************************
        이미지 처리
        ***************************************************************************/
       
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
                    // 이미지가 아니면 링크로 변환
                    if (!imageExtensions.test(docName)) {
                        // 1) 불필요한 특수문자 제거 + 공백을 '-'로 치환
                        const sanitizedDocName = docName
                            .replace(/[^가-힣a-zA-Z0-9\s]+/g, '') 
                            .replace(/\s+/g, '-');
                        
                        // 2) URL 인코딩 (%EC%9A%B4.. 식으로 변환)
                        const encodedDocName = encodeURIComponent(sanitizedDocName);

                        // 3) 마크다운 링크로 반환 (끝에 / 추가)
                        return `[${docName}](${settings.blogUrl}/${encodedDocName}/)`;
                    }
                    // 이미지인 경우에는 원본 그대로 반환
                    return match;
                }
            );
        }

        // 문서 링크 전처리 (이미지 마크다운이 아닌 일반 [[링크]] 구문)
        if (options.enableDocLink) {
            processedPost = processedPost.replace(
                /\[\[(.+?)]]/g,
                (_, docName) => {
                    // 1) 불필요한 특수문자 제거 + 공백을 '-'로 치환
                    const cleanName = docName
                        .replace(/[^가-힣a-zA-Z0-9\s]+/g, '')
                        .replace(/\s+/g, '-');
                    
                    // 2) URL 인코딩
                    const encodedName = encodeURIComponent(cleanName);
                    
                    // 3) "[표시 텍스트](인코딩된URL)" 형태의 링크 (끝에 / 추가)
                    return `[${docName}](${settings.blogUrl}/${encodedName}/)`;
                }
            );

            processedPost = processedPost.replace(
                /\^\[\[\[(.+?)]]](?!\])/g,
                (_, docName) => {
                    // 1) 불필요한 특수문자 제거 + 공백을 '-'로 치환
                    const cleanName = docName
                        .replace(/[^가-힣a-zA-Z0-9\s]+/g, '')
                        .replace(/\s+/g, '-');
                    
                    // 2) URL 인코딩
                    const encodedName = encodeURIComponent(cleanName);
                    
                    // 3) 각주 형식의 링크로 변환
                    return `^[[${docName}](${settings.blogUrl}/${encodedName}/)]`;
                }
            );
        }

        /***************************************************************************
        코드 블록 처리
        ***************************************************************************/

        // 코드 블록 언어 소문자 변환
        if (options.enableLowercaseCodeLang) {
            processedPost = processedPost.replace(
                /```([A-Z][a-zA-Z0-9#]*)/g,
                (match, lang) => `\`\`\`${lang.toLowerCase()}`
            );
        }

        // 콜아웃 내 코드 블록의 이스케이프된 꺾쇠 괄호 처리
        if (options.enableCalloutCodeBlockEscape) {
            // 콜아웃 블록 내의 코드 블록을 찾아서 처리
            processedPost = processedPost.replace(
                /^(?:\s*>)+\s*```[\s\S]*?```/gm,
                match => {
                    // 이스케이프된 꺾쇠 괄호를 일반 꺾쇠 괄호로 변환
                    return match.replace(/\\([<>])/g, '$1');
                }
            );
        }

        // 코드 블록 내의 탭을 공백으로 변환
        if (options.enableTabToSpaces) {
            const spaces = ' '.repeat(options.tabSize);
            processedPost = processedPost.replace(
                /```[\s\S]*?```/g,  // 코드 블록 전체를 찾는 정규식
                codeBlock => {
                    // 코드 블록의 첫 줄(```)과 마지막 줄(```)은 제외하고 탭을 변환
                    const lines = codeBlock.split('\n');
                    const processedLines = lines.map((line, index) => {
                        // 첫 줄과 마지막 줄은 그대로 유지
                        if (index === 0 || index === lines.length - 1) {
                            return line;
                        }
                        // 나머지 줄의 탭을 공백으로 변환
                        return line.replace(/\t/g, spaces);
                    });
                    return processedLines.join('\n');
                }
            );
        }

        /***************************************************************************
        수식 처리
        ***************************************************************************/

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
            // \sum^{A}_{B} -> \sum_{B}^{A} 변환 (중괄호가 모두 있는 경우)
            processedPost = processedPost.replace(
                /\\(sum|int|prod|coprod|bigcup|bigcap|bigoplus|bigotimes|bigsqcup)\^{([^}]*)}\_{([^}]*)}/g,
                '\\$1_{$3}^{$2}'
            );

            // \sum^A_{b} -> \sum_{b}^{A} 변환 (위첨자에 중괄호가 없는 경우)
            processedPost = processedPost.replace(
                /\\(sum|int|prod|coprod|bigcup|bigcap|bigoplus|bigotimes|bigsqcup)\^([^{}_\s]+)\_{([^}]*)}/g,
                '\\$1_{$3}^{$2}'
            );
            
            // \sum^{a}_b -> \sum_b^{a} 변환 (아래첨자에 중괄호가 없는 경우)
            processedPost = processedPost.replace(
                /\\(sum|int|prod|coprod|bigcup|bigcap|bigoplus|bigotimes|bigsqcup)\^{([^}]*)}\_([^{}_\s]+)/g,
                '\\$1_{$3}^{$2}'
            );

            // \sum^A_B -> \sum_{B}^{A} 변환 (둘 다 중괄호가 없는 경우)
            processedPost = processedPost.replace(
                /\\(sum|int|prod|coprod|bigcup|bigcap|bigoplus|bigotimes|bigsqcup)\^([^{}_\s]+)\_([^{}_\s]+)/g,
                '\\$1_{$3}^{$2}'
            );
        }

        /**
         * 리스트 항목 뒤에 '딱 수식만' 있는 경우, 수식 앞에 '\' 붙이기
         */
        if (options.enableListMathEscape) {
            processedPost = processedPost.replace(
                /^(\s*(?:>+\s*)*(?:[-*]|\d+\.)\s+)(\${1,2}[^$]*?\${1,2})(\s*)$/gm,
                (match, listPart, mathPart, spaceAfter) => {
                    // 이미 \$ 로 시작하면 그대로 반환
                    if (mathPart.startsWith('\\$')) {
                        return match;
                    }
                    // 수식 앞에 \ 추가
                    return `${listPart}\\${mathPart}${spaceAfter}`;
                }
            );
        }
  
        // 수식 내 파이프라인 변환
        if (options.enableMathPipe) {
            // 디스플레이 수식 ($$...$$) 처리
            processedPost = processedPost.replace(/\$\$(.*?)\$\$/gs, (match, content) => {
                return '$$' + content.replace(/(?<!\\)\|(?!\|)/g, '\\mid') + '$$';
            });

            // 인라인 수식 ($...$) 처리 - 수정된 부분
            processedPost = processedPost.replace(/\$(.*?)\$/g, (match, content) => {
                return '$' + content.replace(/(?<!\\)\|(?!\|)/g, '\\mid') + '$';
            });
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
        
        // 인라인 수식($...$)을 디스플레이 수식($$...$$)으로 변환
        if (options.enableInlineToDisplay) {
            // 1. 먼저 디스플레이 수식($$...$$)을 임시 토큰으로 치환
            let mathBlocks: string[] = [];
            let tokenizedPost = processedPost.replace(/\$\$[^$]*?\$\$/g, (match) => {
                mathBlocks.push(match);
                return `__MATH_BLOCK_${mathBlocks.length - 1}__`;
            });

            // 2. 그 다음 인라인 수식($...$)을 처리
            tokenizedPost = tokenizedPost.replace(/\$[^$]*?\$/g, (match) => {
                mathBlocks.push(match);
                return `__MATH_BLOCK_${mathBlocks.length - 1}__`;
            });

            // 3. 각 수식 블록을 처리
            mathBlocks = mathBlocks.map(block => {
                // 이미 디스플레이 수식($$...$$)인 경우는 그대로 반환
                if (block.startsWith('$$') && block.endsWith('$$')) {
                    return block;
                }
                // 달러 기호로 분리
                const parts = block.split('$').filter(p => p !== '');
                // 각 부분을 $$...$$로 변환하고 줄바꿈으로 연결
                return parts.map(p => `$$${p}$$`).join('\n');
            });

            // 4. 임시 토큰을 처리된 수식으로 교체
            processedPost = tokenizedPost.replace(/__MATH_BLOCK_(\d+)__/g, 
                (_, index) => mathBlocks[parseInt(index)]);
        }


        /***************************************************************************
        나머지 처리
        ***************************************************************************/

        // URL 자동 하이퍼링크 변환
        if (options.enableAutoHyperlink) {
            processedPost = processedPost.replace(
                /(?<![\[\(])https?:\/\/[^\s\]]+/g,
                match => `<${match}>`
            );
        }

        // 하이라이트 전처리
        if (options.enableHighlight) {
            processedPost = processedPost.replace(
                /==(.*?)==/g,
                `${options.highlightSeparator}$1${options.highlightSeparator}`
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