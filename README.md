# MyStream Web
MyStream의 웹 페이지는 [MyStream API](https://github.com/awebow/MyStream-API)가 제공하는 서비스를 웹 페이지로 사용할 수 있게 해주는 프론트엔드입니다. 웹 페이지는 [Vue.js](https://vuejs.org) v3를 이용하여 Single Page Application으로 개발되었습니다.

## Getting Started
### 프로젝트 설치
우선 다음 명령어를 통해 프로젝트를 로컬 디스크에 저장합니다.
```console
$ git clone https://github.com/awebow/mystream-web
```

clone이 완료되면, 다음 명령어를 통해 프로젝트 디렉토리로 이동하고 필요한 패키지를 설치합니다.
```console
$ cd mystream-web
$ npm install
```

### 설정 구성
아래 설정 사항들을 환경변수로 설정하거나 `.env.local` 파일에 [dotenv](https://github.com/motdotla/dotenv) 형식으로 작성합니다.
```
VUE_APP_TITLE=[사이트의 페이지 제목]
BASE_URL=[사이트의 Base URL]
VUE_APP_API_URL=[API 서버의 URL, 필수]
VUE_APP_VIDEO_STORAGE_URL=[동영상 저장소의 URL, 필수]
VUE_APP_IMAGE_STORAGE_URL=[이미지 저장소의 URL, 필수]
VUE_APP_ENCODER_URL=[인코더 서버의 URL, 필수]
VUE_APP_NOTIFICATION_WS_URL=[웹 소켓 알림 서버의 엔드포인트 URL, 필수]
VUE_APP_CHANNEL_CREATABLE=[사용자의 채널 생성 허용 여부(true|false), 필수]
```

## 개발 서버 실행
```console
$ npm run serve
```

## 프로덕션 파일 빌드
```console
$ npm run build
```