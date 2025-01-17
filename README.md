# Jekyll Chirpy Git Exporter

클릭 한번으로 Obsidian 내의 게시물을 Git 저장소로 업로드합니다.
게시물은 자동으로 Jekyll Chirpy 테마 형식에 맞게 변환됩니다.

- <https://qlsjtmek2.github.io/posts/Obsidian%EA%B3%BC-Git-Blog-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0/>

## Installation Guide

1. Git 저장소를 클론합니다.
2. Obsidian Vault 디렉토리로 이동합니다.
3. .obsidian/plugins 디렉토리에 클론한 저장소를 복사합니다.
4. Obsidian을 재시작합니다.
5. Obsidian 설정에서 플러그인을 활성화합니다.

## Configuration

Required Settings:
- Blog Post Path
- Export Path
- Git Configuration

Optional Settings:
- OpenAI API Key (자동 태깅 기능 사용 시 필요)
- Blog URL (문서 링크 및 참조 전처리 기능 사용 시 필요)

## How to Get OpenAI API Key

1. https://platform.openai.com/api-keys 접속
2. 프로젝트가 없는 경우 새로 생성
3. API Keys 메뉴에서 Create New Secret Key로 키 생성

생성 후 충전된 금액이 없으면 동작하지 않을 수 있습니다.
이 경우, 금액을 충전하면 해결됩니다.

## Git Configuration Guide

Git 업로드 기능을 사용하기 위해서 Github 토큰을 발행해야 합니다.

1. GitHub.com에 로그인합니다.
2. 우측 상단의 프로필 아이콘 클릭 → Settings 선택
3. 좌측 하단의 "Developer settings" 클릭
4. "Personal access tokens" → "Tokens (classic)" 선택
5. "Generate new token" → "Generate new token (classic)" 클릭
6. 토큰 이름 입력
7. Expiration을 No expiration으로 변경
8. "repo" 권한 체크
9. 토큰 생성 후 복사해둡니다.

이후 Obsidian의 플러그인 설정에서 토큰을 입력해주면 됩니다.

## How to Use

업로드 하고싶은 옵시디언 노트를 켜놓고, 왼쪽의 "Export Post" 버튼을 누르면 됩니다.

![image](https://github.com/user-attachments/assets/bd1b5ad6-d6c7-4f60-921e-f670d1540e20)

여러개의 노트를 한번에 업로드하고 싶은 경우, 폴더를 우클릭하고 "Export Post"를 선택합니다.

![image](https://github.com/user-attachments/assets/d7ea105d-9419-46c1-bdae-6d5e836cfae2)

폴더 내의 모든 노트를 한번에 업로드하고 싶은 경우, Ctrl + P 또는 Command + P를 눌러 "All"을 검색합니다.

![image](https://github.com/user-attachments/assets/a4b3120b-1f26-4927-abaa-fadd2283eb52)

이후 "Obsidian Jekyll Chirpy Sync: All Export in Blog Post Path"를 선택합니다.

플러그인 설정에서 설정된 "Blog Path" 경로 내의 모든 노트가 업로드됩니다.

업로드한 Post를 삭제하고 싶은 경우, 해당 Post를 우클릭하고 "Delete Post"를 선택합니다.

만약 Post를 한번에 삭제하고 싶은 경우, 해당 폴더를 우클릭하고 "Delete Post"를 선택합니다.


# Obsidian Jekyll Chirpy Sync

Upload posts from Obsidian to a Git repository with a single click.
Posts are automatically converted to the Jekyll Chirpy theme format.

## Installation Guide

1. Clone the Git repository.
2. Navigate to your Obsidian Vault directory.
3. Copy the cloned repository into the .obsidian/plugins directory.
4. Restart Obsidian.
5. Enable the plugin in Obsidian settings.

## Configuration  

Required Settings:
- Blog Post Path
- Export Path
- Git Configuration

Optional Settings:
- OpenAI API Key (required for automatic tagging functionality)
- Blog URL (required for document linking and reference preprocessing features)

## How to Get OpenAI API Key

1. Visit https://platform.openai.com/api-keys
2. If you don't have a project, create a new one.
3. In the API Keys menu, click "Create New Secret Key" to generate a key.
Note: The API key may not function if there are no funds in your account. In that case, add credit to your account to resolve the issue.

## Git Configuration Guide

To use the Git upload feature, you need to generate a GitHub token.

1. Log in to GitHub.com.
2. Click on your profile icon in the top right corner → Select Settings.
3. Click on Developer settings at the bottom left.
4. Choose Personal access tokens → Tokens (classic).
5. Click Generate new token → Generate new token (classic).
6. Enter a token name.
7. Set Expiration to No expiration.
8. Check the repo permission.
9. Generate the token and copy it for later use.
10. Afterward, enter this token in the plugin settings within Obsidian.

## How to Use

To upload an Obsidian note:

![image](https://github.com/user-attachments/assets/bd1b5ad6-d6c7-4f60-921e-f670d1540e20)

Open the note you want to upload.
Click the Export Post button on the left side.


To upload multiple notes at once:

![image](https://github.com/user-attachments/assets/d7ea105d-9419-46c1-bdae-6d5e836cfae2)

Right-click on a folder and select Export Post.


If you want to upload all notes within a folder at once:

Press Ctrl + P (Windows/Linux) or Command + P (Mac) to open the command palette.
Type and select All to search for related commands.

![image](https://github.com/user-attachments/assets/a4b3120b-1f26-4927-abaa-fadd2283eb52)

Then choose Obsidian Jekyll Chirpy Sync: All Export in Blog Post Path.
All notes in the folder specified by the Blog Path setting in the plugin will be uploaded.

To delete a post:
Right-click on a post and select Delete Post.

To delete multiple posts at once:
Right-click on a folder and select Delete Post.

