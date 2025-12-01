### Frontend

In our case, we developed the frontend using Node.js, React + Vite technologies, Firebase for deployment, and the IDE
tool we used (IntelliJ) manually organizing and generating directories of folders and files (as reflected in the
repository itself).

Install Java JDK version 17 to ensure successful application creation with the next tools:

To install Node.js, click the button to redirect to the download; make sure to download the installer for the operating
system you are using.*

Install IDE IntelliJ, we are using a student license for academic use.

* src - This directory houses most of the project's resources, such as assets, components, hooks, images, models, pages,
  services, etc. It's where we configure the user interface, human-computer interaction, API functionality, and define
  routes, as well as the pages that make up the entire application.
* uploads - For storing the images that we will receive from the user on the frontend and transmitting that data to the
  backend for saving and references in the database.

We created a firebase account, created a new app project and following the commands provided by the page itself in the
IDE terminal.

Once all the previously tested resources have been created in development, we proceed to execute the following commands
to link the source project to Firebase.

```bash
firebase init
```

We enabled continuous integration with the repository and selected Firebase hosting since this will serve the purpose of
deploying the frontend.

For continuous integration, we had to create a firebase-hosting.yml file, inserting code and logic to authenticate and
validate the service that Firebase attempts to request from GitHub to collect the relevant data from the repository and
perform the deployment.

And once all the relevant configurations have been made, we consider the deployment complete.

![img_1.png](./docs/images/img_1.png)

In case you need a installation, here are the guide:

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

## Backend

For the backend, we developed the application using Spring Boot 3, Java 17, and Maven as the dependency and build
management tool. For deployment, we used Railway, a cloud platform that allows easy deployment of Java applications.
We also configured the necessary environment variables, such as the database connection credentials, server port, and
any custom Spring Boot properties.

### How to deploy with Railway?

1. Create the MySQL service.

2. Create a service pointing to the GitHub repository where Spring Boot is located.

![railway](./docs/images/railway.png)

3. We configure our environment variables:

    - `APP_PORT`: The port where our backend will be deployed

    - `CORS_ALLOWED_ORIGINS`: The allowed URL for making requests to the backend from a browser

    - `JWT_SECRET_KEY`: The key the backend uses to sign JWT tokens

    - `MYSQLDATABASE`: The database name

    - `MYSQLHOST`: The database URL

    - `MYSQLPASSWORD`: The database password

    - `MYSQLPORT`: The port where the database is hosted

    - `MYSQLUSER`: The database username

    - `RAILPACK_JDK_VERSION`: To change the Java version Railpack installs

    - `SPRING_PROFILES_ACTIVE`: To change the application.properties file it executes, in this case to
      `application-prod.properties`
   

4. Since our repository is a monorepo where Spring Boot is the backend And React as Frontend Railway will detect both
   technologies, and will fail because it won't know if it needs our ```application.properties``` or our ```package.json```. In the
   **Settings** section we can put the ```Root Directory``` to tell Railway which technology we want to deploy.

![railway-environment-variables](./docs/images/railway-environment-variables.png)