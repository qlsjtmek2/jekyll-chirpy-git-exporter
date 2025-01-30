export const getText = (language: 'en' | 'ko' | 'zh' | 'ja' | 'es' | 'de' | 'ru'): TextType => {
    switch (language) {
        case 'ko':
            return ko;
        case 'zh':
            return zh;
        case 'ja':
            return ja;
        case 'es':
            return es;
        case 'de':
            return de;
        case 'ru':
            return ru;
        case 'en':
        default:
            return en;
    }
};

export type TextType = {
    ribbon: {
        exportPost: {
            icon: string;
            tooltip: string;
        };
    };
    notice: {
        noActiveFile: string;
        invalidFile: string;
        notInBlogPath: string;
        startExport: (count: number) => string;
        exportSuccess: (count: number) => string;
        gitUploadSuccess: string;
        gitUploadFailed: string;
        noFilesInBlogPath: string;
        deletePostFailed: (message: string) => string;
        notBlogPost: string;
    };
    menu: {
        exportPost: {
            singleFile: string;
            multipleFiles: (count: number) => string;
            icon: string;
        };
        deletePost: {
            singleFile: string;
            multipleFiles: (count: number) => string;
            icon: string;
        };
    };
    commands: {
        exportPost: {
            id: string;
            name: string;
        };
        exportAllPosts: {
            id: string;
            name: string;
        };
        deletePost: {
            id: string;
            name: string;
        };
    };
    settings: {
        sections: {
            required: string;
            preprocessing: string;
            git: string;
        };
        language: {
            name: string;
            desc: string;
        };
        blogPostPath: {
            name: string;
            desc: string;
            placeholder: string;
        };
        preprocessing: {
            autoTagging: {
                name: string;
                desc: string;
            };
            callout: {
                name: string;
                desc: string;
            };
            calloutTitleSeparator: {
                name: string;
                desc: string;
                placeholder: string;
            };
            calloutAutoTitle: {
                name: string;
                desc: string;
            };
            highlight: {
                name: string;
                desc: string;
            };
            highlightSeparator: {
                name: string;
                desc: string;
                placeholder: string;
            };
            docLink: {
                name: string;
                desc: string;
            };
            docRef: {
                name: string;
                desc: string;
            };
            image: {
                name: string;
                desc: string;
            };
            imagePosition: {
                name: string;
                desc: string;
                options: {
                    normal: string;
                    left: string;
                    right: string;
                };
            };
            imageShadow: {
                name: string;
                desc: string;
            };
            rawTag: {
                name: string;
                desc: string;
            };
            mathNotation: {
                name: string;
                desc: string;
            };
            mathLineBreak: {
                name: string;
                desc: string;
            };
            mathPipe: {
                name: string;
                desc: string;
            };
            matrixLineBreak: {
                name: string;
                desc: string;
            };
            inlineToDisplay: {
                name: string;
                desc: string;
            };
            listMathEscape: {
                name: string;
                desc: string;
            };
            lowercaseCodeLang: {
                name: string;
                desc: string;
            };
            calloutCodeBlockEscape: {
                name: string;
                desc: string;
            };
            tabToSpaces: {
                name: string;
                desc: string;
            };
            tabSize: {
                name: string;
                desc: string;
                placeholder: string;
                notice: string;
            };
            autoHyperlink: {
                name: string;
                desc: string;
            };
        };
        git: {
            enable: {
                name: string;
                desc: string;
            };
            owner: {
                name: string;
                desc: string;
                placeholder: string;
            };
            repo: {
                name: string;
                desc: string;
                placeholder: string;
            };
            branch: {
                name: string;
                desc: string;
                placeholder: string;
            };
            token: {
                name: string;
                desc: string;
                placeholder: string;
            };
            uploadPostPath: {
                name: string;
                desc: string;
                placeholder: string;
            };
            uploadImagePath: {
                name: string;
                desc: string;
                placeholder: string;
            };
            commitMessageTemplate: {
                name: string;
                desc: string;
                placeholder: string;
            };
            imagePath: {
                name: string;
                desc: string;
                placeholder: string;
            };
            deleteConfirmation: {
                name: string;
                desc: string;
            };
            deleteCommitTemplate: {
                name: string;
                desc: string;
                placeholder: string;
            };
        };
        exportPath: {
            name: string;
            desc: string;
            placeholder: string;
        };
        openAIKey: {
            name: string;
            desc: string;
            placeholder: string;
        };
        blogUrl: {
            name: string;
            desc: string;
            placeholder: string;
        };
    };
    modal: {
        deleteConfirm: {
            title: string;
            message: (filename: string) => string;
            delete: string;
            cancel: string;
        };
    };
    git: {
        fileNotExist: (path: string) => string;
        deleteSuccess: (count: number) => string;
        uploadImageSuccess: (count: number) => string;
        errors: {
            uploadFailed: (path: string) => string;
            uploadImagesFailed: string;
            uploadPostAndImagesFailed: string;
            deletePostFailed: string;
            fileNotFound: (path: string) => string;
            readImageFailed: (path: string) => string;
            processImageFailed: (path: string) => string;
            updateRefFailed: string;
            uploadFilesFailed: string;
            imagePathUndefined: string;
            fileNotExistYet: (path: string) => string;
        };
    };
    metadata: {
        errors: {
            openAIError: (error: string) => string;
        };
        prompts: {
            generateTags: (content: string) => string;
        };
    };
};

/** =========================
 *  English (en)
 *  ========================= */
const en: TextType = {
    ribbon: {
        exportPost: {
            icon: 'book-up-2',
            tooltip: 'Export blog post'
        }
    },
    notice: {
        noActiveFile: 'No active file',
        invalidFile: 'Invalid file',
        notInBlogPath: 'Some selected files are not in the blog post path',
        startExport: (count: number) => `Starting to export ${count} files...`,
        exportSuccess: (count: number) => `Successfully exported ${count} blog posts`,
        gitUploadSuccess: 'Blog post and images uploaded to Git successfully',
        gitUploadFailed: 'Git upload failed',
        noFilesInBlogPath: 'No files in blog post path',
        deletePostFailed: (message: string) => `Failed to delete post: ${message}`,
        notBlogPost: 'Current file is not a blog post'
    },
    menu: {
        exportPost: {
            singleFile: 'Export post',
            multipleFiles: (count: number) => `Export posts (${count})`,
            icon: 'book-up-2'
        },
        deletePost: {
            singleFile: 'Delete post',
            multipleFiles: (count: number) => `Delete posts (${count})`,
            icon: 'trash'
        }
    },
    commands: {
        exportPost: {
            id: 'process-event-queue',
            name: 'Export blog post'
        },
        exportAllPosts: {
            id: 'export-all-posts',
            name: 'Export all blog post files'
        },
        deletePost: {
            id: 'delete-blog-post',
            name: 'Delete blog post'
        }
    },
    settings: {
        sections: {
            required: 'Required',
            preprocessing: 'Preprocessing',
            git: 'Git'
        },
        language: {
            name: 'Language',
            desc: 'Select the language for the application'
        },
        blogPostPath: {
            name: 'Blog post path',
            desc: 'Enter the path to your blog posts',
            placeholder: 'e.g., /path/to/blog-posts'
        },
        preprocessing: {
            autoTagging: {
                name: 'Auto tagging',
                desc: 'Enable/disable automatic tagging using OpenAI'
            },
            callout: {
                name: 'Callout preprocessing',
                desc: 'Enable/disable callout block preprocessing'
            },
            calloutTitleSeparator: {
                name: 'Callout title separator',
                desc: 'Specify the separator for callout titles',
                placeholder: '{title}'
            },
            calloutAutoTitle: {
                name: 'Callout auto title',
                desc: 'Use type as title when callout title is empty'
            },
            highlight: {
                name: 'Highlight preprocessing',
                desc: 'Enable/disable highlight text preprocessing'
            },
            highlightSeparator: {
                name: 'Highlight separator',
                desc: 'Specify the string to wrap highlight text',
                placeholder: '**'
            },
            docLink: {
                name: 'Document link preprocessing',
                desc: 'Enable/disable document link preprocessing'
            },
            docRef: {
                name: 'Document reference preprocessing',
                desc: 'Enable/disable document reference preprocessing'
            },
            image: {
                name: 'Image preprocessing',
                desc: 'Enable/disable image preprocessing'
            },
            imagePosition: {
                name: 'Image position',
                desc: 'Set the default alignment position for images',
                options: {
                    normal: 'Default',
                    left: 'Left',
                    right: 'Right'
                }
            },
            imageShadow: {
                name: 'Image shadow',
                desc: 'Apply shadow effect to images'
            },
            rawTag: {
                name: 'Raw tag conversion',
                desc: 'Convert double curly braces to {% raw %} tags'
            },
            mathNotation: {
                name: 'Math notation preprocessing',
                desc: 'Convert math notation to LaTeX standard format'
            },
            mathLineBreak: {
                name: 'Math line break',
                desc: 'Add line breaks before and after display math ($$...$$)'
            },
            mathPipe: {
                name: 'Math pipe conversion',
                desc: 'Convert pipe (|) in math to \\mid'
            },
            matrixLineBreak: {
                name: 'Matrix line break',
                desc: 'Add spaces around line breaks (\\\\) in matrix environment'
            },
            inlineToDisplay: {
                name: 'Inline to display math',
                desc: 'Convert inline math ($) to display math ($$)'
            },
            listMathEscape: {
                name: 'List math escape',
                desc: 'Add escape (\\) before math in list items'
            },
            lowercaseCodeLang: {
                name: 'Code block language lowercase',
                desc: 'Convert code block language to lowercase'
            },
            calloutCodeBlockEscape: {
                name: 'Callout code block escape',
                desc: 'Convert escaped angle brackets in callout blocks'
            },
            tabToSpaces: {
                name: 'Tab to spaces',
                desc: 'Convert tab characters to spaces in code blocks'
            },
            tabSize: {
                name: 'Tab size',
                desc: 'Number of spaces for each tab character',
                placeholder: '4',
                notice: 'Please enter a valid number.'
            },
            autoHyperlink: {
                name: 'Auto hyperlink',
                desc: 'Convert standalone URLs to hyperlinks'
            }
        },
        git: {
            enable: {
                name: 'Enable git upload',
                desc: 'Automatically upload files to GitHub'
            },
            owner: {
                name: 'Repository owner',
                desc: 'Enter the GitHub repository owner\'s username',
                placeholder: 'username'
            },
            repo: {
                name: 'Repository name',
                desc: 'Enter the GitHub repository name',
                placeholder: 'repository-name'
            },
            branch: {
                name: 'Branch name',
                desc: 'Enter the branch name to upload to',
                placeholder: 'main'
            },
            token: {
                name: 'GitHub token',
                desc: 'Enter your GitHub personal access token',
                placeholder: 'ghp_...'
            },
            uploadPostPath: {
                name: 'Post upload location',
                desc: 'Path within the Git repository for blog posts',
                placeholder: '_posts'
            },
            uploadImagePath: {
                name: 'Image upload location',
                desc: 'Path within the Git repository for images',
                placeholder: 'assets/img/posts'
            },
            commitMessageTemplate: {
                name: 'Commit message template',
                desc: 'Template for commit messages ({count} for file count)',
                placeholder: 'docs: add {count} posts'
            },
            imagePath: {
                name: 'Image folder location',
                desc: 'Path where image files are stored in Obsidian',
                placeholder: 'assets/img'
            },
            deleteConfirmation: {
                name: 'Delete confirmation',
                desc: 'Show confirmation dialog before deleting posts'
            },
            deleteCommitTemplate: {
                name: 'Delete commit template',
                desc: 'Template for delete commit messages ({filename} for file name)',
                placeholder: 'docs: delete post - {filename}'
            }
        },
        exportPath: {
            name: 'Export path',
            desc: 'Path to export preprocessed files',
            placeholder: 'Example: _posts'
        },
        openAIKey: {
            name: 'OpenAI API key',
            desc: 'API key for auto tagging feature',
            placeholder: 'sk-...'
        },
        blogUrl: {
            name: 'Blog URL',
            desc: 'Your blog URL for internal links',
            placeholder: 'https://example.com'
        }
    },
    modal: {
        deleteConfirm: {
            title: 'Confirm Delete Post',
            message: (filename: string) => `Do you want to delete "${filename}" from Git?`,
            delete: 'Delete',
            cancel: 'Cancel'
        }
    },
    git: {
        fileNotExist: (path: string) => `File does not exist in remote repository: ${path}`,
        deleteSuccess: (count: number) => `${count} posts have been deleted from Git repository`,
        uploadImageSuccess: (count: number) => `Successfully uploaded ${count} images in a single commit`,
        errors: {
            uploadFailed: (path: string) => `Failed to upload file: ${path}`,
            uploadImagesFailed: 'Failed to upload images',
            uploadPostAndImagesFailed: 'Failed to upload post and images',
            deletePostFailed: 'Failed to delete posts',
            fileNotFound: (path: string) => `Image file not found: ${path}`,
            readImageFailed: (path: string) => `Failed to read image: ${path}`,
            processImageFailed: (path: string) => `Error processing image: ${path}`,
            updateRefFailed: 'Failed to update ref',
            uploadFilesFailed: 'Failed to upload files',
            imagePathUndefined: 'Image path is undefined',
            fileNotExistYet: (path: string) => `File does not exist yet: ${path}`,
        }
    },
    metadata: {
        errors: {
            openAIError: (error: string) => `OpenAI API ERROR: ${error}`,
        },
        prompts: {
            generateTags: (content: string) =>
                `Analyze the following text and extract 5-8 key keywords (tags).\n\n` +
                `Text:\n${content}\n\n` +
                `Output format: Only keywords separated by commas, no additional text.`
        }
    }
};

/** =========================
 *  Korean (ko) - 기준(참조)
 *  ========================= */
const ko: TextType = {
    ribbon: {
        exportPost: {
            icon: 'book-up-2',
            tooltip: '블로그 포스트 내보내기'
        }
    },
    notice: {
        noActiveFile: '활성화된 파일이 없습니다',
        invalidFile: '유효하지 않은 파일입니다',
        notInBlogPath: '선택된 일부 파일이 블로그 포스트 경로에 없습니다',
        startExport: (count: number) => `${count}개의 파일 내보내기를 시작합니다...`,
        exportSuccess: (count: number) => `${count}개의 블로그 포스트를 성공적으로 내보냈습니다`,
        gitUploadSuccess: '블로그 포스트와 이미지가 Git에 성공적으로 업로드되었습니다',
        gitUploadFailed: 'Git 업로드에 실패했습니다',
        noFilesInBlogPath: '블로그 포스트 경로에 파일이 없습니다',
        deletePostFailed: (message: string) => `포스트 삭제 실패: ${message}`,
        notBlogPost: '현재 파일은 블로그 포스트가 아닙니다'
    },
    menu: {
        exportPost: {
            singleFile: '포스트 내보내기',
            multipleFiles: (count: number) => `포스트 내보내기 (${count}개)`,
            icon: 'book-up-2'
        },
        deletePost: {
            singleFile: '포스트 삭제',
            multipleFiles: (count: number) => `포스트 삭제 (${count}개)`,
            icon: 'trash'
        }
    },
    commands: {
        exportPost: {
            id: 'process-event-queue',
            name: '블로그 포스트 내보내기'
        },
        exportAllPosts: {
            id: 'export-all-posts',
            name: '모든 블로그 포스트 파일 내보내기'
        },
        deletePost: {
            id: 'delete-blog-post',
            name: '블로그 포스트 삭제'
        }
    },
    settings: {
        sections: {
            required: '필수 설정',
            preprocessing: '전처리 옵션',
            git: 'Git 설정'
        },
        language: {
            name: '언어',
            desc: '표시 언어를 선택하세요'
        },
        blogPostPath: {
            name: '블로그 포스트 경로',
            desc: '옵시디언 내에서 블로그 포스트로 사용될 폴더의 경로를 지정합니다.',
            placeholder: '예: Blog Posts'
        },
        preprocessing: {
            autoTagging: {
                name: '자동 태깅',
                desc: 'OpenAI를 사용한 자동 태깅 기능을 활성화/비활성화합니다.'
            },
            callout: {
                name: '콜아웃 전처리',
                desc: '콜아웃 블록의 전처리를 활성화/비활성화합니다.'
            },
            calloutTitleSeparator: {
                name: '콜아웃 타이틀 구분자',
                desc: '콜아웃 블록의 타이틀을 구분하는 문자열을 지정합니다.',
                placeholder: '{title}'
            },
            calloutAutoTitle: {
                name: '콜아웃 자동 제목',
                desc: '콜아웃의 제목이 비어있을 때 type을 제목으로 사용합니다.'
            },
            highlight: {
                name: '하이라이트 전처리',
                desc: '하이라이트 텍스트의 전처리를 활성화/비활성화합니다.'
            },
            highlightSeparator: {
                name: '하이라이트 구분자',
                desc: '하이라이트 텍스트를 감싸는 문자열을 지정합니다.',
                placeholder: '**'
            },
            docLink: {
                name: '문서 링크 전처리',
                desc: '문서 링크의 전처리를 활성화/비활성화합니다.'
            },
            docRef: {
                name: '문서 참조 전처리',
                desc: '문서 참조의 전처리를 활성화/비활성화합니다.'
            },
            image: {
                name: '이미지 전처리',
                desc: '이미지의 전처리를 활성화/비활성화합니다.'
            },
            imagePosition: {
                name: '이미지 위치',
                desc: '이미지의 기본 정렬 위치를 설정합니다.',
                options: {
                    normal: '기본',
                    left: '왼쪽',
                    right: '오른쪽'
                }
            },
            imageShadow: {
                name: '이미지 그림자',
                desc: '이미지에 그림자 효과를 적용합니다.'
            },
            rawTag: {
                name: '이중 중괄호 Raw 태그 변환',
                desc: '수식 내 이중 중괄호를 {% raw %} 태그로 변환합니다.'
            },
            mathNotation: {
                name: '수식 표기법 전처리',
                desc: '수식에서 위/아래 첨자의 순서를 LaTeX 표준 형식으로 변환합니다.'
            },
            mathLineBreak: {
                name: '수식 줄바꿈 처리',
                desc: '디스플레이 수식($$...$$)의 앞뒤에 줄바꿈을 추가합니다.'
            },
            mathPipe: {
                name: '수식 내 파이프라인 변환',
                desc: '수식 내의 파이프(|)를 \\mid로 변환합니다.'
            },
            matrixLineBreak: {
                name: '매트릭스 줄바꿈 공백 추가',
                desc: 'matrix 환경에서 줄바꿈(\\\\) 양 옆에 공백을 추가합니다.'
            },
            inlineToDisplay: {
                name: '인라인 수식을 디스플레이 수식으로 변환',
                desc: '단일 달러($)로 둘러싸인 인라인 수식을 이중 달러($$)로 변환합니다.'
            },
            listMathEscape: {
                name: '리스트 수식 이스케이프',
                desc: '리스트 항목(-나 *) 뒤의 수식 앞에 이스케이프(\\)를 추가합니다.'
            },
            lowercaseCodeLang: {
                name: '코드 블록 언어 소문자 변환',
                desc: '코드 블록의 언어를 소문자로 변환합니다.'
            },
            calloutCodeBlockEscape: {
                name: '콜아웃 내 코드 블록 이스케이프 처리',
                desc: '콜아웃 내 코드 블록의 이스케이프된 꺾쇠 괄호(\\<, \\>)를 일반 꺾쇠 괄호(<, >)로 변환합니다.'
            },
            tabToSpaces: {
                name: '코드블록 내 탭을 공백으로 변환',
                desc: '코드블록 내의 탭 문자를 공백으로 변환합니다.'
            },
            tabSize: {
                name: '탭 크기',
                desc: '탭 문자를 몇 개의 공백으로 변환할지 설정합니다.',
                placeholder: '4',
                notice: '유효한 숫자를 입력해주세요.'
            },
            autoHyperlink: {
                name: 'URL 자동 하이퍼링크',
                desc: '단독으로 있는 URL을 자동으로 하이퍼링크로 변환합니다.'
            }
        },
        git: {
            enable: {
                name: 'Git 업로드 활성화',
                desc: 'GitHub에 자동으로 파일을 업로드합니다.'
            },
            owner: {
                name: '저장소 소유자',
                desc: 'GitHub 저장소 소유자의 사용자명을 입력하세요.',
                placeholder: 'username'
            },
            repo: {
                name: '저장소 이름',
                desc: 'GitHub 저장소 이름을 입력하세요.',
                placeholder: 'repository-name'
            },
            branch: {
                name: '브랜치',
                desc: '업로드할 브랜치 이름을 입력하세요.',
                placeholder: 'main'
            },
            token: {
                name: 'GitHub 토큰',
                desc: 'GitHub Personal Access Token을 입력하세요.',
                placeholder: 'ghp_...'
            },
            uploadPostPath: {
                name: '포스트 업로드 경로',
                desc: '블로그 포스트가 업로드될 Git Repository 내 경로를 입력하세요.',
                placeholder: '_posts'
            },
            uploadImagePath: {
                name: '이미지 업로드 경로',
                desc: '이미지 파일이 업로드될 Git Repository 내 경로를 입력하세요.',
                placeholder: 'assets/img/posts'
            },
            commitMessageTemplate: {
                name: '커밋 메시지 템플릿',
                desc: '파일 업로드 시 사용할 커밋 메시지 템플릿. {count}는 업로드된 파일 개수를 의미합니다.',
                placeholder: 'docs: add {count} posts'
            },
            imagePath: {
                name: '이미지 경로',
                desc: '옵시디언 내의 이미지 파일이 저장된 경로를 입력하세요.',
                placeholder: 'assets/img'
            },
            deleteConfirmation: {
                name: '삭제 확인',
                desc: '게시물 삭제 전 확인 대화상자를 표시합니다.'
            },
            deleteCommitTemplate: {
                name: '삭제 커밋 메시지',
                desc: '게시물 삭제 시 사용할 커밋 메시지 템플릿. {filename}은 삭제된 파일명으로 대체됩니다.',
                placeholder: 'docs: delete post - {filename}'
            }
        },
        exportPath: {
            name: '내보내기 경로',
            desc: '전처리된 .md 파일을 내보낼 폴더의 경로를 지정합니다.',
            placeholder: '예: Exported Posts'
        },
        openAIKey: {
            name: 'OpenAI API Key',
            desc: 'OpenAI API를 사용하기 위한 API 키를 입력하세요.',
            placeholder: 'sk-...'
        },
        blogUrl: {
            name: '블로그 URL',
            desc: '블로그 URL을 입력하세요. (끝에 / 미포함)',
            placeholder: 'https://your-blog.com'
        }
    },
    modal: {
        deleteConfirm: {
            title: '포스트 삭제 확인',
            message: (filename: string) => `"${filename}"을(를) Git에서 삭제하시겠습니까?`,
            delete: '삭제',
            cancel: '취소'
        }
    },
    git: {
        fileNotExist: (path: string) => `원격 저장소에 파일이 존재하지 않습니다: ${path}`,
        deleteSuccess: (count: number) => `${count}개의 포스트가 Git 저장소에서 삭제되었습니다`,
        uploadImageSuccess: (count: number) => `${count}개의 이미지를 하나의 커밋으로 업로드했습니다`,
        errors: {
            uploadFailed: (path: string) => `파일 업로드 실패: ${path}`,
            uploadImagesFailed: '이미지 업로드 실패',
            uploadPostAndImagesFailed: '포스트와 이미지 업로드 실패',
            deletePostFailed: '포스트 삭제 실패',
            fileNotFound: (path: string) => `이미지 파일을 찾을 수 없습니다: ${path}`,
            readImageFailed: (path: string) => `이미지 읽기 실패: ${path}`,
            processImageFailed: (path: string) => `이미지 처리 중 오류 발생: ${path}`,
            updateRefFailed: '참조 업데이트 실패',
            uploadFilesFailed: '파일 업로드 실패',
            imagePathUndefined: '이미지 경로가 정의되지 않았습니다',
            fileNotExistYet: (path: string) => `파일이 아직 존재하지 않습니다: ${path}`,
        }
    },
    metadata: {
        errors: {
            openAIError: (error: string) => `OpenAI API 오류: ${error}`,
        },
        prompts: {
            generateTags: (content: string) =>
                `다음 글을 분석하여 핵심 키워드(태그) 5 ~ 8개를 추출해 주세요.\n\n` +
                `글:\n${content}\n\n` +
                `출력 형식: 키워드만 콤마로 구분, 불필요한 말 없이.`
        }
    }
};

/** =========================
 *  Chinese (zh)
 *  ========================= */
const zh: TextType = {
    ribbon: {
        exportPost: {
            icon: 'book-up-2',
            tooltip: '导出博客文章'
        }
    },
    notice: {
        noActiveFile: '当前没有激活的文件',
        invalidFile: '无效的文件',
        notInBlogPath: '部分选定的文件不在博客文章路径中',
        startExport: (count: number) => `开始导出 ${count} 个文件...`,
        exportSuccess: (count: number) => `成功导出了 ${count} 篇博客文章`,
        gitUploadSuccess: '博客文章和图片已成功上传到 Git',
        gitUploadFailed: 'Git 上传失败',
        noFilesInBlogPath: '博客文章路径中没有任何文件',
        deletePostFailed: (message: string) => `删除文章失败: ${message}`,
        notBlogPost: '当前文件不是博客文章'
    },
    menu: {
        exportPost: {
            singleFile: '导出文章',
            multipleFiles: (count: number) => `导出文章 (${count} 个)`,
            icon: 'book-up-2'
        },
        deletePost: {
            singleFile: '删除文章',
            multipleFiles: (count: number) => `删除文章 (${count} 个)`,
            icon: 'trash'
        }
    },
    commands: {
        exportPost: {
            id: 'process-event-queue',
            name: '导出博客文章'
        },
        exportAllPosts: {
            id: 'export-all-posts',
            name: '导出所有博客文章文件'
        },
        deletePost: {
            id: 'delete-blog-post',
            name: '删除博客文章'
        }
    },
    settings: {
        sections: {
            required: '必需设置',
            preprocessing: '预处理选项',
            git: 'Git 设置'
        },
        language: {
            name: '语言',
            desc: '选择应用程序的显示语言'
        },
        blogPostPath: {
            name: '博客文章路径',
            desc: '指定在 Obsidian 中用作博客文章的文件夹路径',
            placeholder: '例如：Blog Posts'
        },
        preprocessing: {
            autoTagging: {
                name: '自动标签',
                desc: '启用或禁用使用 OpenAI 的自动标签功能'
            },
            callout: {
                name: '标注（Callout）预处理',
                desc: '启用或禁用标注块的预处理'
            },
            calloutTitleSeparator: {
                name: '标注标题分隔符',
                desc: '指定用于分隔标注块标题的分隔符',
                placeholder: '{title}'
            },
            calloutAutoTitle: {
                name: '标注自动标题',
                desc: '如果标注标题为空，则使用类型作为标题'
            },
            highlight: {
                name: '高亮预处理',
                desc: '启用或禁用对高亮文本的预处理'
            },
            highlightSeparator: {
                name: '高亮分隔符',
                desc: '指定用于包裹高亮文本的字符串',
                placeholder: '**'
            },
            docLink: {
                name: '文档链接预处理',
                desc: '启用或禁用对文档链接的预处理'
            },
            docRef: {
                name: '文档引用预处理',
                desc: '启用或禁用对文档引用的预处理'
            },
            image: {
                name: '图片预处理',
                desc: '启用或禁用对图片的预处理'
            },
            imagePosition: {
                name: '图片位置',
                desc: '设置图片的默认对齐方式',
                options: {
                    normal: '默认',
                    left: '左对齐',
                    right: '右对齐'
                }
            },
            imageShadow: {
                name: '图片阴影',
                desc: '为图片添加阴影效果'
            },
            rawTag: {
                name: '双大括号 Raw 标签转换',
                desc: '将公式中的双大括号转换为 {% raw %} 标签'
            },
            mathNotation: {
                name: '数学符号预处理',
                desc: '将数学公式中的上下标顺序转换为 LaTeX 标准格式'
            },
            mathLineBreak: {
                name: '数学公式换行',
                desc: '在行间公式($$...$$)的前后添加换行'
            },
            mathPipe: {
                name: '数学管道符转换',
                desc: '将数学公式中的管道符(|)转换为 \\mid'
            },
            matrixLineBreak: {
                name: '矩阵换行空格',
                desc: '在矩阵环境中的换行符(\\\\)两侧添加空格'
            },
            inlineToDisplay: {
                name: '行内公式转行间公式',
                desc: '将单个美元符($)包裹的行内公式转换为双美元符($$)的行间公式'
            },
            listMathEscape: {
                name: '列表中的数学公式转义',
                desc: '在列表项后面的数学公式前添加转义符(\\)'
            },
            lowercaseCodeLang: {
                name: '代码块语言小写',
                desc: '将代码块语言转换为小写'
            },
            calloutCodeBlockEscape: {
                name: '标注内代码块转义',
                desc: '将标注中代码块的转义尖括号(\\<, \\>)还原为普通尖括号(<, >)'
            },
            tabToSpaces: {
                name: 'Tab 转为空格',
                desc: '将代码块中的 Tab 替换为空格'
            },
            tabSize: {
                name: 'Tab 大小',
                desc: '设置每个 Tab 替换成多少个空格',
                placeholder: '4',
                notice: '请输入有效的数字'
            },
            autoHyperlink: {
                name: '自动超链接',
                desc: '将独立的 URL 自动转换为超链接'
            }
        },
        git: {
            enable: {
                name: '启用 Git 上传',
                desc: '自动将文件上传到 GitHub'
            },
            owner: {
                name: '仓库所有者',
                desc: '输入 GitHub 仓库所有者的用户名',
                placeholder: 'username'
            },
            repo: {
                name: '仓库名称',
                desc: '输入 GitHub 仓库名称',
                placeholder: 'repository-name'
            },
            branch: {
                name: '分支名称',
                desc: '输入要上传到的分支名称',
                placeholder: 'main'
            },
            token: {
                name: 'GitHub token',
                desc: '输入你的 GitHub personal access token',
                placeholder: 'ghp_...'
            },
            uploadPostPath: {
                name: '文章上传路径',
                desc: '博客文章在 Git 仓库中的存放路径',
                placeholder: '_posts'
            },
            uploadImagePath: {
                name: '图片上传路径',
                desc: '图片在 Git 仓库中的存放路径',
                placeholder: 'assets/img/posts'
            },
            commitMessageTemplate: {
                name: '提交信息模板',
                desc: '提交信息的模板 ({count} 表示文件数)',
                placeholder: 'docs: add {count} posts'
            },
            imagePath: {
                name: '图片文件夹路径',
                desc: '在 Obsidian 中存放图片文件的路径',
                placeholder: 'assets/img'
            },
            deleteConfirmation: {
                name: '删除确认',
                desc: '在删除文章之前显示确认对话框'
            },
            deleteCommitTemplate: {
                name: '删除提交模板',
                desc: '删除文章时使用的提交信息模板 ({filename} 表示文件名)',
                placeholder: 'docs: delete post - {filename}'
            }
        },
        exportPath: {
            name: '导出路径',
            desc: '指定预处理后文件的导出文件夹路径',
            placeholder: '例如：_posts'
        },
        openAIKey: {
            name: 'OpenAI API Key',
            desc: '用于自动标签功能的 OpenAI API key',
            placeholder: 'sk-...'
        },
        blogUrl: {
            name: '博客 URL',
            desc: '用于内部链接的博客 URL（末尾不带 /）',
            placeholder: 'https://your-blog.com'
        }
    },
    modal: {
        deleteConfirm: {
            title: '确认删除文章',
            message: (filename: string) => `是否确定从 Git 中删除 "${filename}"？`,
            delete: '删除',
            cancel: '取消'
        }
    },
    git: {
        fileNotExist: (path: string) => `远程仓库中不存在文件：${path}`,
        deleteSuccess: (count: number) => `已从 Git 仓库中删除了 ${count} 篇文章`,
        uploadImageSuccess: (count: number) => `已在一次提交中成功上传了 ${count} 张图片`,
        errors: {
            uploadFailed: (path: string) => `文件上传失败：${path}`,
            uploadImagesFailed: '图片上传失败',
            uploadPostAndImagesFailed: '文章和图片上传失败',
            deletePostFailed: '删除文章失败',
            fileNotFound: (path: string) => `未找到图片文件：${path}`,
            readImageFailed: (path: string) => `读取图片失败：${path}`,
            processImageFailed: (path: string) => `处理图片时出错：${path}`,
            updateRefFailed: '更新引用失败',
            uploadFilesFailed: '文件上传失败',
            imagePathUndefined: '图片路径未定义',
            fileNotExistYet: (path: string) => `文件尚不存在：${path}`,
        }
    },
    metadata: {
        errors: {
            openAIError: (error: string) => `OpenAI API 错误：${error}`,
        },
        prompts: {
            generateTags: (content: string) =>
                `分析以下文本并提取 5~8 个关键词（标签）：\n\n` +
                `文本：\n${content}\n\n` +
                `输出格式：只输出关键词，用逗号分隔，不要额外文字。`
        }
    }
};

/** =========================
 *  Japanese (ja)
 *  ========================= */
const ja: TextType = {
    ribbon: {
        exportPost: {
            icon: 'book-up-2',
            tooltip: 'ブログ記事をエクスポート'
        }
    },
    notice: {
        noActiveFile: 'アクティブなファイルがありません',
        invalidFile: '無効なファイルです',
        notInBlogPath: '選択されたファイルの一部がブログ記事用フォルダにありません',
        startExport: (count: number) => `${count}件のファイルをエクスポートします...`,
        exportSuccess: (count: number) => `${count}件のブログ記事を正常にエクスポートしました`,
        gitUploadSuccess: 'ブログ記事と画像が正常にGitにアップロードされました',
        gitUploadFailed: 'Gitへのアップロードに失敗しました',
        noFilesInBlogPath: 'ブログ記事フォルダにファイルがありません',
        deletePostFailed: (message: string) => `記事の削除に失敗しました: ${message}`,
        notBlogPost: '現在のファイルはブログ記事ではありません'
    },
    menu: {
        exportPost: {
            singleFile: '記事をエクスポート',
            multipleFiles: (count: number) => `記事をエクスポート (${count}件)`,
            icon: 'book-up-2'
        },
        deletePost: {
            singleFile: '記事を削除',
            multipleFiles: (count: number) => `記事を削除 (${count}件)`,
            icon: 'trash'
        }
    },
    commands: {
        exportPost: {
            id: 'process-event-queue',
            name: 'ブログ記事をエクスポート'
        },
        exportAllPosts: {
            id: 'export-all-posts',
            name: 'すべてのブログ記事ファイルをエクスポート'
        },
        deletePost: {
            id: 'delete-blog-post',
            name: 'ブログ記事を削除'
        }
    },
    settings: {
        sections: {
            required: '必須設定',
            preprocessing: '前処理オプション',
            git: 'Git設定'
        },
        language: {
            name: '言語',
            desc: 'アプリの表示言語を選択します'
        },
        blogPostPath: {
            name: 'ブログ記事パス',
            desc: 'Obsidian内でブログ記事として使用するフォルダのパスを指定します',
            placeholder: '例: Blog Posts'
        },
        preprocessing: {
            autoTagging: {
                name: '自動タグ付け',
                desc: 'OpenAIを使用した自動タグ付けを有効/無効にします'
            },
            callout: {
                name: 'コールアウト前処理',
                desc: 'コールアウトブロックの前処理を有効/無効にします'
            },
            calloutTitleSeparator: {
                name: 'コールアウトタイトル区切り',
                desc: 'コールアウトブロックのタイトルを区切る文字列を指定します',
                placeholder: '{title}'
            },
            calloutAutoTitle: {
                name: 'コールアウト自動タイトル',
                desc: 'コールアウトのタイトルが空の場合はタイプをタイトルとして使用します'
            },
            highlight: {
                name: 'ハイライト前処理',
                desc: 'ハイライトテキストの前処理を有効/無効にします'
            },
            highlightSeparator: {
                name: 'ハイライト区切り文字',
                desc: 'ハイライトテキストを囲む文字列を指定します',
                placeholder: '**'
            },
            docLink: {
                name: 'ドキュメントリンク前処理',
                desc: 'ドキュメントリンクの前処理を有効/無効にします'
            },
            docRef: {
                name: 'ドキュメント参照前処理',
                desc: 'ドキュメント参照の前処理を有効/無効にします'
            },
            image: {
                name: '画像前処理',
                desc: '画像の前処理を有効/無効にします'
            },
            imagePosition: {
                name: '画像位置',
                desc: '画像のデフォルトの配置を設定します',
                options: {
                    normal: 'デフォルト',
                    left: '左寄せ',
                    right: '右寄せ'
                }
            },
            imageShadow: {
                name: '画像シャドウ',
                desc: '画像にシャドウ効果を適用します'
            },
            rawTag: {
                name: '二重中括弧 Rawタグ変換',
                desc: '数式内の二重中括弧を {% raw %} タグに変換します'
            },
            mathNotation: {
                name: '数式表記前処理',
                desc: '数式内の上下付き文字の順序をLaTeX標準形式に変換します'
            },
            mathLineBreak: {
                name: '数式改行',
                desc: 'ディスプレイ数式($$...$$)の前後に改行を追加します'
            },
            mathPipe: {
                name: '数式内パイプ記号変換',
                desc: '数式内のパイプ(|)を \\mid に変換します'
            },
            matrixLineBreak: {
                name: '行列改行の空白追加',
                desc: '行列環境内の改行(\\\\)の両側に空白を追加します'
            },
            inlineToDisplay: {
                name: 'インライン数式をディスプレイに変換',
                desc: '単一ドル($)で囲まれた数式を二重ドル($$)のディスプレイ数式に変換します'
            },
            listMathEscape: {
                name: 'リスト数式エスケープ',
                desc: 'リスト項目の後ろに続く数式の前にエスケープ(\\)を追加します'
            },
            lowercaseCodeLang: {
                name: 'コードブロック言語小文字化',
                desc: 'コードブロックの言語を小文字に変換します'
            },
            calloutCodeBlockEscape: {
                name: 'コールアウト内コードブロックエスケープ',
                desc: 'コールアウト内のコードブロックでエスケープされた山括弧(\\<, \\>)を通常の(<, >)に変換します'
            },
            tabToSpaces: {
                name: 'タブをスペースに変換',
                desc: 'コードブロック内のタブ文字をスペースに変換します'
            },
            tabSize: {
                name: 'タブサイズ',
                desc: 'タブ文字を何個のスペースに変換するかを設定します',
                placeholder: '4',
                notice: '有効な数値を入力してください'
            },
            autoHyperlink: {
                name: 'URL自動ハイパーリンク',
                desc: '単独のURLを自動的にハイパーリンクに変換します'
            }
        },
        git: {
            enable: {
                name: 'Gitアップロードを有効化',
                desc: 'ファイルを自動でGitHubにアップロードします'
            },
            owner: {
                name: 'リポジトリ所有者',
                desc: 'GitHubリポジトリ所有者のユーザー名を入力します',
                placeholder: 'username'
            },
            repo: {
                name: 'リポジトリ名',
                desc: 'GitHubリポジトリの名前を入力します',
                placeholder: 'repository-name'
            },
            branch: {
                name: 'ブランチ名',
                desc: 'アップロード先のブランチ名を入力します',
                placeholder: 'main'
            },
            token: {
                name: 'GitHub token',
                desc: 'GitHub Personal Access Tokenを入力します',
                placeholder: 'ghp_...'
            },
            uploadPostPath: {
                name: '記事アップロードパス',
                desc: 'Gitリポジトリ内でブログ記事を格納するパス',
                placeholder: '_posts'
            },
            uploadImagePath: {
                name: '画像アップロードパス',
                desc: 'Gitリポジトリ内で画像を格納するパス',
                placeholder: 'assets/img/posts'
            },
            commitMessageTemplate: {
                name: 'コミットメッセージテンプレート',
                desc: 'コミットメッセージのテンプレート（{count}はファイル数を表します）',
                placeholder: 'docs: add {count} posts'
            },
            imagePath: {
                name: '画像フォルダの場所',
                desc: 'Obsidian内で画像ファイルを保存するパスを入力します',
                placeholder: 'assets/img'
            },
            deleteConfirmation: {
                name: '削除確認',
                desc: '記事を削除する前に確認ダイアログを表示します'
            },
            deleteCommitTemplate: {
                name: '削除コミットテンプレート',
                desc: '記事削除時に使用するコミットメッセージのテンプレート（{filename}は削除するファイル名）',
                placeholder: 'docs: delete post - {filename}'
            }
        },
        exportPath: {
            name: 'エクスポートパス',
            desc: '前処理後のファイルをエクスポートするフォルダのパスを指定します',
            placeholder: '例: Exported Posts'
        },
        openAIKey: {
            name: 'OpenAI API Key',
            desc: '自動タグ付け機能に使用するOpenAIのAPIキーを入力します',
            placeholder: 'sk-...'
        },
        blogUrl: {
            name: 'ブログURL',
            desc: '内部リンクのためのブログURL（末尾の / は含まない）',
            placeholder: 'https://your-blog.com'
        }
    },
    modal: {
        deleteConfirm: {
            title: '記事削除の確認',
            message: (filename: string) => `"${filename}"をGitから削除してもよろしいですか？`,
            delete: '削除',
            cancel: 'キャンセル'
        }
    },
    git: {
        fileNotExist: (path: string) => `リモートリポジトリにファイルが存在しません: ${path}`,
        deleteSuccess: (count: number) => `${count}件の記事をGitリポジトリから削除しました`,
        uploadImageSuccess: (count: number) => `${count}枚の画像を1つのコミットとしてアップロードしました`,
        errors: {
            uploadFailed: (path: string) => `ファイルのアップロードに失敗しました: ${path}`,
            uploadImagesFailed: '画像のアップロードに失敗しました',
            uploadPostAndImagesFailed: '記事と画像のアップロードに失敗しました',
            deletePostFailed: '記事の削除に失敗しました',
            fileNotFound: (path: string) => `画像ファイルが見つかりません: ${path}`,
            readImageFailed: (path: string) => `画像の読み込みに失敗しました: ${path}`,
            processImageFailed: (path: string) => `画像処理エラー: ${path}`,
            updateRefFailed: 'リファレンスの更新に失敗しました',
            uploadFilesFailed: 'ファイルのアップロードに失敗しました',
            imagePathUndefined: '画像パスが未定義です',
            fileNotExistYet: (path: string) => `ファイルがまだ存在しません: ${path}`,
        }
    },
    metadata: {
        errors: {
            openAIError: (error: string) => `OpenAI APIエラー: ${error}`,
        },
        prompts: {
            generateTags: (content: string) =>
                `以下の文章を分析し、5～8個のキーワード（タグ）を抽出してください。\n\n` +
                `文章:\n${content}\n\n` +
                `出力形式：キーワードのみをカンマ区切りで、余分な説明は不要です。`
        }
    }
};

/** =========================
 *  Spanish (es)
 *  ========================= */
const es: TextType = {
    ribbon: {
        exportPost: {
            icon: 'book-up-2',
            tooltip: 'Exportar entrada del blog'
        }
    },
    notice: {
        noActiveFile: 'No hay ningún archivo activo',
        invalidFile: 'Archivo inválido',
        notInBlogPath: 'Algunos de los archivos seleccionados no están en la ruta de entradas del blog',
        startExport: (count: number) => `Iniciando la exportación de ${count} archivos...`,
        exportSuccess: (count: number) => `Se han exportado correctamente ${count} entradas del blog`,
        gitUploadSuccess: 'La entrada del blog y las imágenes se han subido correctamente a Git',
        gitUploadFailed: 'Error al subir a Git',
        noFilesInBlogPath: 'No hay archivos en la ruta de entradas del blog',
        deletePostFailed: (message: string) => `Error al eliminar la publicación: ${message}`,
        notBlogPost: 'El archivo actual no es una entrada de blog'
    },
    menu: {
        exportPost: {
            singleFile: 'Exportar entrada',
            multipleFiles: (count: number) => `Exportar entradas (${count})`,
            icon: 'book-up-2'
        },
        deletePost: {
            singleFile: 'Eliminar entrada',
            multipleFiles: (count: number) => `Eliminar entradas (${count})`,
            icon: 'trash'
        }
    },
    commands: {
        exportPost: {
            id: 'process-event-queue',
            name: 'Exportar entrada del blog'
        },
        exportAllPosts: {
            id: 'export-all-posts',
            name: 'Exportar todas las entradas del blog'
        },
        deletePost: {
            id: 'delete-blog-post',
            name: 'Eliminar entrada del blog'
        }
    },
    settings: {
        sections: {
            required: 'Configuración requerida',
            preprocessing: 'Opciones de preprocesamiento',
            git: 'Configuración de Git'
        },
        language: {
            name: 'Idioma',
            desc: 'Selecciona el idioma de la aplicación'
        },
        blogPostPath: {
            name: 'Ruta de las entradas del blog',
            desc: 'Especifica la carpeta en Obsidian donde se ubicarán las entradas del blog',
            placeholder: 'Ejemplo: Blog Posts'
        },
        preprocessing: {
            autoTagging: {
                name: 'Etiquetado automático',
                desc: 'Activar/desactivar etiquetado automático con OpenAI'
            },
            callout: {
                name: 'Preprocesamiento de callouts',
                desc: 'Activar/desactivar el preprocesamiento de bloques de callout'
            },
            calloutTitleSeparator: {
                name: 'Separador de título del callout',
                desc: 'Especifica la cadena para separar el título en el bloque de callout',
                placeholder: '{title}'
            },
            calloutAutoTitle: {
                name: 'Título automático del callout',
                desc: 'Usar el tipo como título cuando el título esté vacío'
            },
            highlight: {
                name: 'Preprocesamiento de resaltado',
                desc: 'Activar/desactivar el preprocesamiento de texto resaltado'
            },
            highlightSeparator: {
                name: 'Separador de resaltado',
                desc: 'Especifica la cadena para rodear el texto resaltado',
                placeholder: '**'
            },
            docLink: {
                name: 'Preprocesamiento de enlaces de documento',
                desc: 'Activar/desactivar el preprocesamiento de enlaces de documento'
            },
            docRef: {
                name: 'Preprocesamiento de referencias',
                desc: 'Activar/desactivar el preprocesamiento de referencias a documentos'
            },
            image: {
                name: 'Preprocesamiento de imágenes',
                desc: 'Activar/desactivar el preprocesamiento de imágenes'
            },
            imagePosition: {
                name: 'Posición de la imagen',
                desc: 'Define la alineación predeterminada de las imágenes',
                options: {
                    normal: 'Predeterminado',
                    left: 'Izquierda',
                    right: 'Derecha'
                }
            },
            imageShadow: {
                name: 'Sombra de la imagen',
                desc: 'Añadir un efecto de sombra a las imágenes'
            },
            rawTag: {
                name: 'Conversión de etiquetas raw',
                desc: 'Convierte llaves dobles en fórmulas a etiquetas {% raw %}'
            },
            mathNotation: {
                name: 'Preprocesamiento de notación matemática',
                desc: 'Convierte el orden de subíndices y superíndices a formato estándar de LaTeX'
            },
            mathLineBreak: {
                name: 'Salto de línea en matemáticas',
                desc: 'Agrega saltos de línea antes y después de las fórmulas en bloque ($$...$$)'
            },
            mathPipe: {
                name: 'Conversión de pipe en matemáticas',
                desc: 'Convierte el símbolo | en \\mid dentro de las fórmulas'
            },
            matrixLineBreak: {
                name: 'Espacio en saltos de línea de matrices',
                desc: 'Agrega espacios alrededor del salto de línea (\\\\) en entornos de matriz'
            },
            inlineToDisplay: {
                name: 'Convierte matemáticas en línea a bloque',
                desc: 'Convierte fórmulas encerradas en $ a $$ (bloque)'
            },
            listMathEscape: {
                name: 'Escape en fórmulas en listas',
                desc: 'Agrega el carácter de escape (\\) antes de fórmulas que siguen a un ítem de lista'
            },
            lowercaseCodeLang: {
                name: 'Lenguaje de código en minúsculas',
                desc: 'Convierte el lenguaje de los bloques de código a minúsculas'
            },
            calloutCodeBlockEscape: {
                name: 'Escape en bloques de código dentro de callouts',
                desc: 'Restaura corchetes angulares escapados (\\<, \\>) a (<, >) en bloques de código dentro de callouts'
            },
            tabToSpaces: {
                name: 'Convertir tabs a espacios',
                desc: 'Convierte las tabulaciones en espacios dentro de bloques de código'
            },
            tabSize: {
                name: 'Tamaño de tabulación',
                desc: 'Número de espacios que representa cada tabulación',
                placeholder: '4',
                notice: 'Por favor, introduce un número válido.'
            },
            autoHyperlink: {
                name: 'Hipervínculos automáticos',
                desc: 'Convierte URL solas en hipervínculos de forma automática'
            }
        },
        git: {
            enable: {
                name: 'Activar carga a Git',
                desc: 'Subir automáticamente los archivos a GitHub'
            },
            owner: {
                name: 'Propietario del repositorio',
                desc: 'Introduce el nombre de usuario del propietario del repositorio en GitHub',
                placeholder: 'username'
            },
            repo: {
                name: 'Nombre del repositorio',
                desc: 'Introduce el nombre del repositorio de GitHub',
                placeholder: 'repository-name'
            },
            branch: {
                name: 'Nombre de la rama',
                desc: 'Introduce el nombre de la rama a la que subirás los archivos',
                placeholder: 'main'
            },
            token: {
                name: 'GitHub token',
                desc: 'Introduce tu token de acceso personal de GitHub',
                placeholder: 'ghp_...'
            },
            uploadPostPath: {
                name: 'Ruta de carga de publicaciones',
                desc: 'Ruta dentro del repositorio Git para las entradas del blog',
                placeholder: '_posts'
            },
            uploadImagePath: {
                name: 'Ruta de carga de imágenes',
                desc: 'Ruta dentro del repositorio Git para las imágenes',
                placeholder: 'assets/img/posts'
            },
            commitMessageTemplate: {
                name: 'Plantilla de mensaje de commit',
                desc: 'Plantilla para los mensajes de commit ({count} indica la cantidad de archivos)',
                placeholder: 'docs: add {count} posts'
            },
            imagePath: {
                name: 'Ubicación de la carpeta de imágenes',
                desc: 'Ruta donde se almacenan las imágenes en Obsidian',
                placeholder: 'assets/img'
            },
            deleteConfirmation: {
                name: 'Confirmación de eliminación',
                desc: 'Muestra un cuadro de confirmación antes de eliminar entradas'
            },
            deleteCommitTemplate: {
                name: 'Plantilla de commit para eliminación',
                desc: 'Plantilla para los mensajes de commit al eliminar entradas ({filename} para el nombre del archivo)',
                placeholder: 'docs: delete post - {filename}'
            }
        },
        exportPath: {
            name: 'Ruta de exportación',
            desc: 'Ruta donde se exportarán los archivos preprocesados',
            placeholder: 'Ejemplo: _posts'
        },
        openAIKey: {
            name: 'OpenAI API Key',
            desc: 'Clave de API para la función de etiquetado automático',
            placeholder: 'sk-...'
        },
        blogUrl: {
            name: 'URL del blog',
            desc: 'La URL de tu blog para enlaces internos (sin la barra final)',
            placeholder: 'https://example.com'
        }
    },
    modal: {
        deleteConfirm: {
            title: 'Confirmar eliminación de entrada',
            message: (filename: string) => `¿Deseas eliminar "${filename}" de Git?`,
            delete: 'Eliminar',
            cancel: 'Cancelar'
        }
    },
    git: {
        fileNotExist: (path: string) => `El archivo no existe en el repositorio remoto: ${path}`,
        deleteSuccess: (count: number) => `Se han eliminado ${count} entradas del repositorio de Git`,
        uploadImageSuccess: (count: number) => `Se han subido correctamente ${count} imágenes en un solo commit`,
        errors: {
            uploadFailed: (path: string) => `Error al subir el archivo: ${path}`,
            uploadImagesFailed: 'Error al subir las imágenes',
            uploadPostAndImagesFailed: 'Error al subir la entrada y las imágenes',
            deletePostFailed: 'Error al eliminar las entradas',
            fileNotFound: (path: string) => `No se encontró el archivo de imagen: ${path}`,
            readImageFailed: (path: string) => `Error al leer la imagen: ${path}`,
            processImageFailed: (path: string) => `Error al procesar la imagen: ${path}`,
            updateRefFailed: 'Error al actualizar la referencia',
            uploadFilesFailed: 'Error al subir los archivos',
            imagePathUndefined: 'La ruta de la imagen no está definida',
            fileNotExistYet: (path: string) => `El archivo aún no existe: ${path}`,
        }
    },
    metadata: {
        errors: {
            openAIError: (error: string) => `ERROR de OpenAI API: ${error}`,
        },
        prompts: {
            generateTags: (content: string) =>
                `Analiza el siguiente texto y extrae entre 5 y 8 palabras clave (etiquetas):\n\n` +
                `Texto:\n${content}\n\n` +
                `Formato de salida: solo palabras clave separadas por comas, sin texto adicional.`
        }
    }
};

/** =========================
 *  German (de)
 *  ========================= */
const de: TextType = {
    ribbon: {
        exportPost: {
            icon: 'book-up-2',
            tooltip: 'Blogbeitrag exportieren'
        }
    },
    notice: {
        noActiveFile: 'Kein aktives Dokument',
        invalidFile: 'Ungültige Datei',
        notInBlogPath: 'Einige ausgewählte Dateien befinden sich nicht im Blogpost-Pfad',
        startExport: (count: number) => `Beginne mit dem Export von ${count} Dateien...`,
        exportSuccess: (count: number) => `${count} Blogbeiträge wurden erfolgreich exportiert`,
        gitUploadSuccess: 'Blogbeitrag und Bilder wurden erfolgreich zu Git hochgeladen',
        gitUploadFailed: 'Fehler beim Hochladen zu Git',
        noFilesInBlogPath: 'Keine Dateien im Blogpost-Pfad vorhanden',
        deletePostFailed: (message: string) => `Fehler beim Löschen des Beitrags: ${message}`,
        notBlogPost: 'Die aktuelle Datei ist kein Blogbeitrag'
    },
    menu: {
        exportPost: {
            singleFile: 'Beitrag exportieren',
            multipleFiles: (count: number) => `Beiträge exportieren (${count})`,
            icon: 'book-up-2'
        },
        deletePost: {
            singleFile: 'Beitrag löschen',
            multipleFiles: (count: number) => `Beiträge löschen (${count})`,
            icon: 'trash'
        }
    },
    commands: {
        exportPost: {
            id: 'process-event-queue',
            name: 'Blogbeitrag exportieren'
        },
        exportAllPosts: {
            id: 'export-all-posts',
            name: 'Alle Blogpost-Dateien exportieren'
        },
        deletePost: {
            id: 'delete-blog-post',
            name: 'Blogbeitrag löschen'
        }
    },
    settings: {
        sections: {
            required: 'Erforderliche Einstellungen',
            preprocessing: 'Vorverarbeitungs-Optionen',
            git: 'Git-Einstellungen'
        },
        language: {
            name: 'Sprache',
            desc: 'Wählen Sie die Sprache der Anwendung'
        },
        blogPostPath: {
            name: 'Blogpost-Pfad',
            desc: 'Geben Sie den Ordnerpfad in Obsidian für Blogbeiträge an',
            placeholder: 'Beispiel: Blog Posts'
        },
        preprocessing: {
            autoTagging: {
                name: 'Automatische Verschlagwortung',
                desc: 'Aktiviert/Deaktiviert die automatische Tag-Generierung mittels OpenAI'
            },
            callout: {
                name: 'Callout-Vorverarbeitung',
                desc: 'Aktivieren/Deaktivieren der Vorverarbeitung von Callout-Blöcken'
            },
            calloutTitleSeparator: {
                name: 'Callout-Titel-Trennzeichen',
                desc: 'Geben Sie das Trennzeichen für den Callout-Titel an',
                placeholder: '{title}'
            },
            calloutAutoTitle: {
                name: 'Automatischer Callout-Titel',
                desc: 'Wenn kein Titel angegeben ist, wird der Typ als Titel verwendet'
            },
            highlight: {
                name: 'Hervorhebungs-Vorverarbeitung',
                desc: 'Aktivieren/Deaktivieren der Vorverarbeitung von hervorgehobenem Text'
            },
            highlightSeparator: {
                name: 'Hervorhebungs-Trennzeichen',
                desc: 'Geben Sie die Zeichenkette an, die den hervorgehobenen Text umschließt',
                placeholder: '**'
            },
            docLink: {
                name: 'Dokumentenlink-Vorverarbeitung',
                desc: 'Aktivieren/Deaktivieren der Vorverarbeitung von Dokumentenlinks'
            },
            docRef: {
                name: 'Dokumentenreferenz-Vorverarbeitung',
                desc: 'Aktivieren/Deaktivieren der Vorverarbeitung von Dokumentenreferenzen'
            },
            image: {
                name: 'Bild-Vorverarbeitung',
                desc: 'Aktivieren/Deaktivieren der Vorverarbeitung von Bildern'
            },
            imagePosition: {
                name: 'Bildposition',
                desc: 'Legen Sie die Standardausrichtung von Bildern fest',
                options: {
                    normal: 'Standard',
                    left: 'Links',
                    right: 'Rechts'
                }
            },
            imageShadow: {
                name: 'Bildschatten',
                desc: 'Fügt einen Schattierungseffekt für Bilder hinzu'
            },
            rawTag: {
                name: 'Raw-Tag-Konvertierung',
                desc: 'Doppelte geschweifte Klammern in Formeln in {% raw %}-Tags umwandeln'
            },
            mathNotation: {
                name: 'Mathematische Notations-Vorverarbeitung',
                desc: 'Konvertiert die Reihenfolge von Hoch- und Tiefstellungen in das LaTeX-Standardformat'
            },
            mathLineBreak: {
                name: 'Zeilenumbrüche bei Formeln',
                desc: 'Fügt vor und nach Display-Math ($$...$$) Zeilenumbrüche ein'
            },
            mathPipe: {
                name: 'Konvertierung von Pipe-Symbolen in Formeln',
                desc: 'Wandelt das Pipe-Symbol (|) in \\mid um'
            },
            matrixLineBreak: {
                name: 'Abstände bei Matrix-Zeilenumbrüchen',
                desc: 'Fügt Leerzeichen um Zeilenumbrüche (\\\\) in Matrix-Umgebungen hinzu'
            },
            inlineToDisplay: {
                name: 'Inline- in Display-Formeln umwandeln',
                desc: 'Wandelt inline Math ($) in Display Math ($$) um'
            },
            listMathEscape: {
                name: 'Escape bei Formeln in Listen',
                desc: 'Fügt ein Escape-Zeichen (\\) vor Formeln ein, die auf Listenpunkte folgen'
            },
            lowercaseCodeLang: {
                name: 'Codeblock-Sprache in Kleinbuchstaben',
                desc: 'Konvertiert den Sprachbezeichner in Codeblöcken in Kleinbuchstaben'
            },
            calloutCodeBlockEscape: {
                name: 'Codeblock-Escape in Callouts',
                desc: 'Setzt in Callouts escapte spitze Klammern (\\<, \\>) wieder in (<, >) um'
            },
            tabToSpaces: {
                name: 'Tabs in Leerzeichen',
                desc: 'Konvertiert Tabulatoren in Codeblöcken in Leerzeichen'
            },
            tabSize: {
                name: 'Tab-Größe',
                desc: 'Anzahl der Leerzeichen, die ein Tabulator repräsentiert',
                placeholder: '4',
                notice: 'Bitte geben Sie eine gültige Zahl ein'
            },
            autoHyperlink: {
                name: 'Automatische Hyperlinks',
                desc: 'Erkennt alleinstehende URLs und wandelt sie in Hyperlinks um'
            }
        },
        git: {
            enable: {
                name: 'Git-Upload aktivieren',
                desc: 'Dateien automatisch auf GitHub hochladen'
            },
            owner: {
                name: 'Repository-Besitzer',
                desc: 'Benutzernamen des GitHub-Repository-Besitzers eingeben',
                placeholder: 'username'
            },
            repo: {
                name: 'Repository-Name',
                desc: 'Namen des GitHub-Repositories eingeben',
                placeholder: 'repository-name'
            },
            branch: {
                name: 'Branch-Name',
                desc: 'Namen des Branches angeben, in den hochgeladen wird',
                placeholder: 'main'
            },
            token: {
                name: 'GitHub token',
                desc: 'Geben Sie Ihren GitHub Personal Access Token ein',
                placeholder: 'ghp_...'
            },
            uploadPostPath: {
                name: 'Beitrags-Upload-Pfad',
                desc: 'Pfad im Git-Repository, in dem Blogbeiträge gespeichert werden',
                placeholder: '_posts'
            },
            uploadImagePath: {
                name: 'Bild-Upload-Pfad',
                desc: 'Pfad im Git-Repository, in dem Bilder gespeichert werden',
                placeholder: 'assets/img/posts'
            },
            commitMessageTemplate: {
                name: 'Commit-Nachricht-Vorlage',
                desc: 'Vorlage für Commit-Nachrichten ({count} für die Anzahl der Dateien)',
                placeholder: 'docs: add {count} posts'
            },
            imagePath: {
                name: 'Bildordner-Pfad',
                desc: 'Pfad, in dem Bilddateien in Obsidian gespeichert werden',
                placeholder: 'assets/img'
            },
            deleteConfirmation: {
                name: 'Löschbestätigung',
                desc: 'Zeigt einen Bestätigungsdialog, bevor Beiträge gelöscht werden'
            },
            deleteCommitTemplate: {
                name: 'Vorlage für Lösch-Commits',
                desc: 'Vorlage für Commit-Nachrichten beim Löschen von Beiträgen ({filename} für Dateiname)',
                placeholder: 'docs: delete post - {filename}'
            }
        },
        exportPath: {
            name: 'Exportpfad',
            desc: 'Pfad zum Exportieren der vorverarbeiteten Dateien',
            placeholder: 'Beispiel: _posts'
        },
        openAIKey: {
            name: 'OpenAI API Key',
            desc: 'API-Schlüssel für die automatische Tag-Funktion',
            placeholder: 'sk-...'
        },
        blogUrl: {
            name: 'Blog-URL',
            desc: 'Ihre Blog-URL für interne Links (ohne abschließenden /)',
            placeholder: 'https://example.com'
        }
    },
    modal: {
        deleteConfirm: {
            title: 'Löschen des Beitrags bestätigen',
            message: (filename: string) => `Möchten Sie "${filename}" wirklich aus Git löschen?`,
            delete: 'Löschen',
            cancel: 'Abbrechen'
        }
    },
    git: {
        fileNotExist: (path: string) => `Datei existiert nicht im Remote-Repository: ${path}`,
        deleteSuccess: (count: number) => `${count} Beiträge wurden aus dem Git-Repository gelöscht`,
        uploadImageSuccess: (count: number) => `${count} Bilder wurden erfolgreich in einem Commit hochgeladen`,
        errors: {
            uploadFailed: (path: string) => `Fehler beim Hochladen der Datei: ${path}`,
            uploadImagesFailed: 'Fehler beim Hochladen der Bilder',
            uploadPostAndImagesFailed: 'Fehler beim Hochladen des Beitrags und der Bilder',
            deletePostFailed: 'Fehler beim Löschen der Beiträge',
            fileNotFound: (path: string) => `Bilddatei nicht gefunden: ${path}`,
            readImageFailed: (path: string) => `Fehler beim Lesen des Bildes: ${path}`,
            processImageFailed: (path: string) => `Fehler bei der Bildverarbeitung: ${path}`,
            updateRefFailed: 'Fehler beim Aktualisieren der Referenz',
            uploadFilesFailed: 'Fehler beim Hochladen der Dateien',
            imagePathUndefined: 'Bildpfad ist nicht definiert',
            fileNotExistYet: (path: string) => `Die Datei existiert noch nicht: ${path}`,
        }
    },
    metadata: {
        errors: {
            openAIError: (error: string) => `OpenAI API-Fehler: ${error}`,
        },
        prompts: {
            generateTags: (content: string) =>
                `Analysieren Sie den folgenden Text und extrahieren Sie 5-8 Schlüsselwörter (Tags):\n\n` +
                `Text:\n${content}\n\n` +
                `Ausgabeformat: Nur durch Kommas getrennte Schlüsselwörter, kein zusätzlicher Text.`
        }
    }
};

/** =========================
 *  Russian (ru)
 *  ========================= */
const ru: TextType = {
    ribbon: {
        exportPost: {
            icon: 'book-up-2',
            tooltip: 'Экспортировать запись блога'
        }
    },
    notice: {
        noActiveFile: 'Нет активного файла',
        invalidFile: 'Недопустимый файл',
        notInBlogPath: 'Некоторые выбранные файлы находятся вне пути для записей блога',
        startExport: (count: number) => `Начинаю экспорт ${count} файлов...`,
        exportSuccess: (count: number) => `Успешно экспортировано ${count} записей блога`,
        gitUploadSuccess: 'Запись блога и изображения успешно загружены в Git',
        gitUploadFailed: 'Ошибка загрузки в Git',
        noFilesInBlogPath: 'Нет файлов в указанном пути для записей блога',
        deletePostFailed: (message: string) => `Не удалось удалить запись: ${message}`,
        notBlogPost: 'Текущий файл не является записью блога'
    },
    menu: {
        exportPost: {
            singleFile: 'Экспорт записи',
            multipleFiles: (count: number) => `Экспорт записей (${count})`,
            icon: 'book-up-2'
        },
        deletePost: {
            singleFile: 'Удалить запись',
            multipleFiles: (count: number) => `Удалить записи (${count})`,
            icon: 'trash'
        }
    },
    commands: {
        exportPost: {
            id: 'process-event-queue',
            name: 'Экспортировать запись блога'
        },
        exportAllPosts: {
            id: 'export-all-posts',
            name: 'Экспортировать все файлы блога'
        },
        deletePost: {
            id: 'delete-blog-post',
            name: 'Удалить запись блога'
        }
    },
    settings: {
        sections: {
            required: 'Обязательные настройки',
            preprocessing: 'Параметры предобработки',
            git: 'Настройки Git'
        },
        language: {
            name: 'Язык',
            desc: 'Выберите язык приложения'
        },
        blogPostPath: {
            name: 'Путь к записям блога',
            desc: 'Укажите папку в Obsidian, где будут храниться записи блога',
            placeholder: 'Например: Blog Posts'
        },
        preprocessing: {
            autoTagging: {
                name: 'Автоматическая разметка тегов',
                desc: 'Включить/выключить автоматическую разметку с помощью OpenAI'
            },
            callout: {
                name: 'Предобработка callout-блоков',
                desc: 'Включить/выключить предобработку блоков callout'
            },
            calloutTitleSeparator: {
                name: 'Разделитель заголовка callout',
                desc: 'Строка, используемая для отделения заголовка в callout-блоках',
                placeholder: '{title}'
            },
            calloutAutoTitle: {
                name: 'Автоматический заголовок callout',
                desc: 'Если заголовок callout пуст, используется его тип'
            },
            highlight: {
                name: 'Предобработка выделенного текста',
                desc: 'Включить/выключить обработку выделенного текста'
            },
            highlightSeparator: {
                name: 'Разделитель выделения',
                desc: 'Строка, обрамляющая выделенный текст',
                placeholder: '**'
            },
            docLink: {
                name: 'Предобработка ссылок на документы',
                desc: 'Включить/выключить предобработку ссылок на документы'
            },
            docRef: {
                name: 'Предобработка документных ссылок',
                desc: 'Включить/выключить предобработку внутренних ссылок на документы'
            },
            image: {
                name: 'Предобработка изображений',
                desc: 'Включить/выключить предобработку изображений'
            },
            imagePosition: {
                name: 'Позиция изображения',
                desc: 'Установить выравнивание изображений по умолчанию',
                options: {
                    normal: 'По умолчанию',
                    left: 'Слева',
                    right: 'Справа'
                }
            },
            imageShadow: {
                name: 'Тень изображения',
                desc: 'Добавить тень для изображений'
            },
            rawTag: {
                name: 'Конвертация двойных фигурных скобок',
                desc: 'Преобразовывать двойные фигурные скобки в формулах в теги {% raw %}'
            },
            mathNotation: {
                name: 'Предобработка математической нотации',
                desc: 'Приводит верхние/нижние индексы к стандарту LaTeX'
            },
            mathLineBreak: {
                name: 'Разрыв строк в формулах',
                desc: 'Добавлять переводы строк до и после блочных формул ($$...$$)'
            },
            mathPipe: {
                name: 'Конвертация символа | в формулах',
                desc: 'Заменяет символ | на \\mid в математических формулах'
            },
            matrixLineBreak: {
                name: 'Пробелы вокруг разрывов строк в матрицах',
                desc: 'Добавляет пробелы вокруг (\\\\) в матричных окружениях'
            },
            inlineToDisplay: {
                name: 'Преобразование встроенных формул в блочные',
                desc: 'Заменяет одиночные $ на $$ (блочная формула)'
            },
            listMathEscape: {
                name: 'Экранирование формул в списках',
                desc: 'Добавляет символ экранирования (\\) перед формулой после элемента списка'
            },
            lowercaseCodeLang: {
                name: 'Язык кода в нижнем регистре',
                desc: 'Преобразовывает язык в кодовых блоках к нижнему регистру'
            },
            calloutCodeBlockEscape: {
                name: 'Экранирование кодовых блоков в callout',
                desc: 'Восстанавливает угловые скобки (\\<, \\>) в (<, >) в кодовых блоках внутри callout'
            },
            tabToSpaces: {
                name: 'Табы в пробелы',
                desc: 'Преобразовать табуляции в кодовых блоках в пробелы'
            },
            tabSize: {
                name: 'Размер табуляции',
                desc: 'Число пробелов на один символ табуляции',
                placeholder: '4',
                notice: 'Пожалуйста, введите корректное число'
            },
            autoHyperlink: {
                name: 'Автоматические гиперссылки',
                desc: 'Автоматически преобразовывать URL в гиперссылки'
            }
        },
        git: {
            enable: {
                name: 'Включить загрузку в Git',
                desc: 'Автоматически загружать файлы в GitHub'
            },
            owner: {
                name: 'Владелец репозитория',
                desc: 'Имя пользователя GitHub, владеющего репозиторием',
                placeholder: 'username'
            },
            repo: {
                name: 'Имя репозитория',
                desc: 'Имя репозитория на GitHub',
                placeholder: 'repository-name'
            },
            branch: {
                name: 'Имя ветки',
                desc: 'Имя ветки, в которую будет выполняться загрузка',
                placeholder: 'main'
            },
            token: {
                name: 'GitHub token',
                desc: 'Введите персональный токен доступа GitHub',
                placeholder: 'ghp_...'
            },
            uploadPostPath: {
                name: 'Путь загрузки поста',
                desc: 'Путь в репозитории Git для размещения записей блога',
                placeholder: '_posts'
            },
            uploadImagePath: {
                name: 'Путь загрузки изображений',
                desc: 'Путь в репозитории Git для размещения изображений',
                placeholder: 'assets/img/posts'
            },
            commitMessageTemplate: {
                name: 'Шаблон сообщения коммита',
                desc: 'Шаблон commit-сообщения ({count} — количество файлов)',
                placeholder: 'docs: add {count} posts'
            },
            imagePath: {
                name: 'Папка с изображениями',
                desc: 'Путь, по которому в Obsidian хранятся файлы изображений',
                placeholder: 'assets/img'
            },
            deleteConfirmation: {
                name: 'Подтверждение удаления',
                desc: 'Отображать диалог подтверждения перед удалением записей'
            },
            deleteCommitTemplate: {
                name: 'Шаблон коммита для удаления',
                desc: 'Шаблон commit-сообщения при удалении записей ({filename} — имя файла)',
                placeholder: 'docs: delete post - {filename}'
            }
        },
        exportPath: {
            name: 'Путь экспорта',
            desc: 'Папка, в которую будут экспортированы предобработанные файлы',
            placeholder: 'Например: Exported Posts'
        },
        openAIKey: {
            name: 'OpenAI API Key',
            desc: 'Ключ API для функции автоматической разметки тегов',
            placeholder: 'sk-...'
        },
        blogUrl: {
            name: 'URL блога',
            desc: 'URL вашего блога для внутренних ссылок (без завершающего слэша)',
            placeholder: 'https://your-blog.com'
        }
    },
    modal: {
        deleteConfirm: {
            title: 'Подтверждение удаления записи',
            message: (filename: string) => `Удалить "${filename}" из Git?`,
            delete: 'Удалить',
            cancel: 'Отмена'
        }
    },
    git: {
        fileNotExist: (path: string) => `Файл не существует в удалённом репозитории: ${path}`,
        deleteSuccess: (count: number) => `Удалено ${count} записей из репозитория Git`,
        uploadImageSuccess: (count: number) => `Успешно загружено ${count} изображений одним коммитом`,
        errors: {
            uploadFailed: (path: string) => `Не удалось загрузить файл: ${path}`,
            uploadImagesFailed: 'Не удалось загрузить изображения',
            uploadPostAndImagesFailed: 'Не удалось загрузить запись и изображения',
            deletePostFailed: 'Не удалось удалить записи',
            fileNotFound: (path: string) => `Файл изображения не найден: ${path}`,
            readImageFailed: (path: string) => `Ошибка чтения изображения: ${path}`,
            processImageFailed: (path: string) => `Ошибка обработки изображения: ${path}`,
            updateRefFailed: 'Не удалось обновить ссылку (ref)',
            uploadFilesFailed: 'Не удалось загрузить файлы',
            imagePathUndefined: 'Путь к изображениям не определён',
            fileNotExistYet: (path: string) => `Файл ещё не существует: ${path}`,
        }
    },
    metadata: {
        errors: {
            openAIError: (error: string) => `Ошибка OpenAI API: ${error}`,
        },
        prompts: {
            generateTags: (content: string) =>
                `Проанализируйте следующий текст и извлеките от 5 до 8 ключевых слов (тегов):\n\n` +
                `Текст:\n${content}\n\n` +
                `Формат вывода: только ключевые слова, разделённые запятыми, без лишнего текста.`
        }
    }
};

export {
    en,
    ko,
    zh,
    ja,
    es,
    de,
    ru
};
