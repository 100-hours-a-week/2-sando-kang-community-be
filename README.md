# 커뮤니티 만들기
카카오테크 클라우드 네이티브 in Jeju 2기 커뮤니티 과제

## <div><img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=header&text=SQUID-WORLD&fontSize=80" /></div>

- - - - - - - - - - - - - - - -


## 작성자
|이름|영문 이름|분야|
|----|---|---|
|[강산아](https://github.com/gsandoo)|sando.kang|카카오테크 클라우드 네이티브 in Jeju 2기|



- - - - - - - - - - - - - - - - - - - - - - - - - - - -

## 오징어월드
![image](https://github.com/user-attachments/assets/7fe36c08-ee85-4897-97c5-fcf3658635aa)



## Stack
<div>
    <img src="https://img.shields.io/badge/JS-7DF1E?style=flat&logo=Express&logoColor=white"/>
</div> 


## 1. 프로젝트 주제
<div>
<h4> KTB 커뮤니티 만들기
</div>

## 2. 개요
<p>
        나만의 웹 커뮤니티를 만들어보는 과제이며 HTML, CSS, JS 사용 능력 향상을 목적을 둔다. 

</p>

## 3. 데이터베이스
![image](https://github.com/user-attachments/assets/8d8e1d8b-88b4-473b-bb66-3167a59fbf70)

## 4. 사용법
 - 테이블 생성
    
    ```sql
        -- 데이터베이스명.`user` definition

        CREATE TABLE `user` (
          `id` int NOT NULL AUTO_INCREMENT,
          `email` varchar(30) NOT NULL,
          `password` varchar(30) NOT NULL,
          `nickname` varchar(10) DEFAULT NULL,
          `profile` longblob,
          PRIMARY KEY (`id`),
          UNIQUE KEY `email` (`email`)
        ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

        
        -- 데이터베이스명.post definition
        
        CREATE TABLE `post` (
          `id` int NOT NULL AUTO_INCREMENT,
          `user_id` int NOT NULL,
          `title` varchar(26) NOT NULL,
          `content` text NOT NULL,
          `image` longblob,
          `date` datetime NOT NULL,
          `likes` int DEFAULT '1',
          `comments` int DEFAULT '1',
          `views` int DEFAULT '1',
          PRIMARY KEY (`id`),
          KEY `user_id` (`user_id`),
          CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


        -- 데이터베이스명.sessions definition

        CREATE TABLE `sessions` (
          `session_id` varchar(128) NOT NULL,
          `expires` int unsigned NOT NULL,
          `data` text,
          PRIMARY KEY (`session_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    
        -- 데이터베이스명.comment definition

        CREATE TABLE `comment` (
          `id` int NOT NULL AUTO_INCREMENT,
          `post_id` int NOT NULL,
          `user_id` int NOT NULL,
          `comment` varchar(30) DEFAULT NULL,
          `date` datetime NOT NULL,
          PRIMARY KEY (`id`),
          KEY `user_id` (`user_id`),
          KEY `post_id` (`post_id`),
          CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
          CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    
    
    ```
- .env.local 파일 작성
   ``` env
        DB_HOST=xxx  // 호스트명         
        DB_USER=xxx  // 사용자명            
        DB_PASSWORD=xxx // 비밀번호
        DB_NAME=xxx     // 데이터베이스명 
  ```     

- 구동
    ``` javascript
        npm install
        node app.js
   ```
--------------------------------------------------------------------------------------------
  ### github 키워드

|keyword|설명|
|----|---|
|Feat|새로운 기능 추가|
|Fix|버그 수정|
|Design|CSS 등 사용자 UI 디자인 변경|
|!BREAKING CHANGE|커다란 API 변경의 경우|
|!HOTFIX|급하게 치명적인 버그를 고쳐야하는 경우|
|Docs|문서 수정|
|Style|코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우|
|Comment|필요한 주석 추가 및 변경|
|Refactor|코드 리펙토링|
|Test|test code, refactoring test code 추가|
|Chore|build 업무 수정, 패키지 매니저 수정|
|Rename|파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우|
|Remove|파일을 삭제하는 작업만 수행한 경우|
