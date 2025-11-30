# Blood4Life

## About this project

This repository constitutes a project that mix all our subjects of the Higher-Level Training Cycle in Web Application
Development
that we are currently completing. The project consists of a full-stack application, meaning it encompasses an entire
server infrastructure that defines its existence, logic, and storage, ensuring complete, robust, and proper
functionality based on configurations we decided upon collectively.

## What does Blood4life do?

It's an app designed to connect blood donors with donation drives organized by hospitals and health centers. The
platform allows donors to quickly and easily find out about drives available in their area and manage their donation history.
Hospitals, in turn, can publish and promote their drives in real time, facilitating donor recruitment and ensuring blood 
availability for those who need it.

## Technologies Used

* Backend: [![SpringBoot](https://img.shields.io/badge/-Spring_Boot-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
* Migrations & seeders: [![FlyWay](https://img.shields.io/badge/-Flyway-CC0200?style=flat&logo=flyway&logoColor=white)](https://flywaydb.org/)
* ORM: [![Hibernate](https://img.shields.io/badge/-Hibernate-59666C?style=flat&logo=hibernate&logoColor=white)](https://hibernate.org/)
* Database: [![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
* Containerization: [![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://docs.docker.com/desktop/setup/install/windows-install/)
* Frontend: [![ReactJS](https://img.shields.io/badge/-ReactJS-09D3AC?style=flat&logo=createreactapp&logoColor=white)](https://es.react.dev/)
* API Endpoints: [![PostMan](https://img.shields.io/badge/-Postman-FF6C37?style=flat&logo=postman&logoColor=white)](https://www.postman.com/)
* Database & Backend deploy: [![Railway](https://img.shields.io/badge/-Railway-0B0D0E?style=flat&logo=railway&logoColor=white)](https://railway.app/)
* Frontend deploy: [![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?style=flat&logo=firebase&logoColor=white)](https://firebase.google.com/?hl=es-419)
* Interface design: [![Figma](https://img.shields.io/badge/-Figma-F24E1E?style=flat&logo=figma&logoColor=white)](https://www.figma.com/)
* Versions control: [![Sourcetree](https://img.shields.io/badge/-Sourcetree-0052CC?style=flat&logo=sourcetree&logoColor=white)](https://www.sourcetreeapp.com/)

## ERD

<img src="docs/images/ERD.png" alt="Diagrama entidad-relación" width="600">

## Use case diagram

<img src="docs/images/use-case-diagram.png" alt="Diagrama de casos de uso" width="600">

## Class diagram

<img src="docs/images/class-diagram.png" alt="Classes diagram" width="600">

# Backend

### Requirements

To run the **backend** of the application, the user must have installed:

- [![JDK 17](https://img.shields.io/badge/-JDK_17-437291?style=flat&logo=openjdk&logoColor=white)](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html)
- [![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://docs.docker.com/desktop/setup/install/windows-install/)

### Instructions to run the backend

1. **Clone the repository**:

```bash
git clone https://github.com/xiomi94/blood4life.git
```

2. Run the .bat file in the repository. This file will automatically configure the ```application.properties``` file to
   prepare the backend environment.

3. Verify if in Docker Desktop there is a new container. You can see that is automatically started.

4. Start Spring Boot

# Frontend

## Requirements

* [![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/download/)
* [![IntelliJ](https://img.shields.io/badge/-IntelliJ_IDEA-000000?style=flat&logo=intellijidea&logoColor=white)](https://www.jetbrains.com/es-es/idea/) (
  Or another IDE, what you want, we chose this)

##### (Optional)

* [![Sourcetree](https://img.shields.io/badge/-Sourcetree-0052CC?style=flat&logo=sourcetree&logoColor=white)](https://www.sourcetreeapp.com/)

First, you need to open a terminal in a directory of your preferences and insert the following command:

```bash
git clone https://github.com/xiomi94/blood4life
```

Then open the IDE:

```bash
npm install 
```

```bash
npm run dev
``` 

to visualizing the app in localhost

#### Firebase section

```bash
firebase init
```

In case is the first time using firebase it will ask you to log in an account.

In our case we selected "Hosting" option, choose your preferences.

```bash
npm run build
```

```bash
firebase deploy
```

Next there will be an explanation for the automatic
deployment (automatic integration).

You need to generate a secret key at console firebase page in project configuration, it results in a file .json format
that need the ```firebase.json``` reference for github

### GitHub Actions + Firebase Hosting Flow (for better explanation we did a diagram simulation)

```text
   [Your GitHub Repository]
               |
               |  (push / merge to main)
               v
     [GitHub Actions Workflow]
               |
               |  uses the secret
               v
   [FIREBASE_SERVICE_ACCOUNT JSON]  <-- secure secret
               |
               |  authentication
               v
          [Firebase Hosting]
               |
               |  receives your build
               v
      [Your app deployed online]
```

### Step-by-step Explanation

```
1. Push to repository: GitHub Actions triggers according to your workflow (on: push).

2. Workflow executes steps: installs Node.js, builds your app, etc.

3. Accesses the secret FIREBASE_SERVICE_ACCOUNT: the JSON tells Firebase that this is an authorized account.

4. Firebase Hosting action uses the JSON to authenticate.

5. Firebase accepts the connection and uploads the build folder (or whatever folder you specified in firebase.json).

6. Your app is live online on Firebase Hosting.
```

## Project Links

* [![Figma](https://img.shields.io/badge/-Figma-F24E1E?style=flat&logo=figma&logoColor=white)](https://www.figma.com/design/b1wzQ5d4tamVixL3SZzZrg/Blood4Life?node-id=0-1&p=f&t=4vENweVa6vCEpXQd-0)
* [![GitHub Project](https://img.shields.io/badge/-Github_Project-181717?style=flat&logo=github&logoColor=white)](https://github.com/users/xiomi94/projects/5/views/1)
* [![PostMan](https://img.shields.io/badge/-Postman-FF6C37?style=flat&logo=postman&logoColor=white)](https://xiomara-7191213.postman.co/workspace/Xiomara's-Workspace~4d5fdf48-7ec3-4099-8a60-e4ffcf9e3fe5/request/45089686-7c413a94-6b6a-424f-ac64-6d65c2734ebf?action=share&creator=45089686&ctx=documentation)

## Authors

| Nombre       | Apellidos         |
|--------------|-------------------|
| Xiomara      | Jiménez Velázquez |
| Juan Antonio | Sánchez Martel    |