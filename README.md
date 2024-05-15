# chan-node : chan's fullstack node boilerplate

## install

- 폴더명은 탐색기를 이용해서 바꾸는게 속편하다.(자바와 달리 루트 디렉토리명이 크게 영향을 끼치지 않는다.)
- `git clone https://github.com/liveforone/chan-node.git 패키지명`
- `.git`삭제
- `cd front/back`
- `npm install`
- `package.json`의 name, version, description을 변경한다.
- 이후 각 readme를 확인한다.

## convention

- directory name은 소문자 시작 카멜케이스로 한다.
- file name은 대문자 시작 카멜케이스로한다.
- controller 관련 상수의 경우 param constant와 url constant으로 분류하되, XxControllerConstant라는 하나의 파일안에 기술한다.
- `schema.prisma`에 기술하는 모든 model, 필드 및 enum 등의 네이밍은 소문자기반 snake case를 사용한다.
- prisma 암시적 변수 사용
- 업데이트 필드가 항상 관계있고, 독립적이지 않다면 통합하여 업데이트 처리, 만약 모든 필드라면 put 매핑으로 처리
