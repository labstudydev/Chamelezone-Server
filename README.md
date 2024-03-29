### Back-End Developer

- 개발자 : 최용권
- 개인 이메일 : chldydrjs94@gmail.com
- 샵인샵 문의사항 : hiyong27@gmail.com

<hr>

### Introduce

- 2019년 트렌드 키워드 복합문화 공간 카멜레존
  - 카멜레존 이란? '카멜레온'과 공간을 뜻하는 '존(zone)'으로 원래의 용도와는 달리 상황에 맞게 변화하는 공간을 뜻
- Google Play Store : [#inshop(샵인샵)](https://play.google.com/store/apps/details?id=tk.yeonaeyong.shopinshop)
- App Naiming
  - #inshop(샵인샵) 이란? '가게 안에 테마(해시태그(#))'라는 뜻
- App Style guide<br>
  <img src="https://user-images.githubusercontent.com/40785404/82349621-4fbdbb80-9a35-11ea-86de-7a5328b92fbe.jpg" width="600" height="400" />

<hr>

### Project function
  &nbsp;&nbsp;<b>&#35; 이름, 지역, 키워드, 지도 검색 기능</b><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;장소의 키워드를 통한 카멜레존 검색<br>
  &nbsp;&nbsp;<b>&#35; 리뷰 서비스</b><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;이미지 필수 리뷰를 통한 검증된 후기 확인<br>
  &nbsp;&nbsp;<b>&#35; 카멜레존 장소 등록 및 사용자 간의 코스 공유</b><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;직접 경험하거나 새롭게 접하게된 카멜레존 장소 및 코스 등록<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;등록된 코스를 통한 카멜레존 공유, 추천 가능<br>
  &nbsp;&nbsp;<b>&#35; 카멜레존 좋아요</b><br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;내가 좋아하는 카멜레존, 가보고 싶은 카멜레존 장소 등록 가능<br>

<hr>

### Preview
![ezgif com-resize_1](https://user-images.githubusercontent.com/40785404/86130681-7a645f00-bb1f-11ea-9820-6593c4c8e1f1.gif)&nbsp;&nbsp;
![ezgif com-resize_2](https://user-images.githubusercontent.com/40785404/86130722-88b27b00-bb1f-11ea-88bc-9906699faf29.gif)&nbsp;&nbsp;
![ezgif com-resize_3](https://user-images.githubusercontent.com/40785404/86130752-9962f100-bb1f-11ea-8305-fb2d66e683b2.gif)

<hr>

### Application technology
- Back-End
  - Node.js Express
  - AWS EC2(ubuntu), AWS RDS(MySQL), AWS Route53
  - Apache
  - HTTPS server
- Tools
  - Visual Studio code
  - MySQL Workbench
  - API 테스트 : Postman
  - 형상관리 : Git
  - AWS EC2 접근 : putty
  - To do List 및 공용 문서 배포 : Google Drive
  - 커뮤니케이션 : Slack
- OS
  - windows10

<hr>

### Architecture
- putty 환경의 forever process로 서버 동작
- HTTPS server, DNS Apache Proxy Pass
- 메인 서버 데이터베이스(chamelezonedb), 개발-테스트 데이터베이스(alpha_chamelezonedb) 총 2개 구성
- RestAPI 로 구성된 API 서버
- callback => Refactoring async/await 진행중
- 3 Layer Architecture 로 구성
  - Express Route Controller : Service- Dao 구조
  - Express Route Controller : 클라이언트 API 호출
  - Service : 비즈니스 로직 작성
  - Dao : SQL Query 관리<br>
    <img src="https://user-images.githubusercontent.com/40785404/82349388-feadc780-9a34-11ea-9a15-bf47e58cc47b.PNG" width="300" height="400" />
