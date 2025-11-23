### Frontend

In our case, we developed the frontend using Node.js, React + Vite technologies, Firebase for deployment, and the IDE tool we used (IntelliJ) manually organizing and generating directories of folders and files (as reflected in the repository itself).

Install Java JDK version 17 to ensure successful application creation with the next tools:

To install Node.js, click the button to redirect to the download; make sure to download the installer for the operating system you are using.*

Install IDE IntelliJ, we are using a student license for academic use.

* src - This directory houses most of the project's resources, such as assets, components, hooks, images, models, pages, services, etc. It's where we configure the user interface, human-computer interaction, API functionality, and define routes, as well as the pages that make up the entire application.
* uploads - For storing the images that we will receive from the user on the frontend and transmitting that data to the backend for saving and references in the database.

We created a firebase account, created a new app project and following the commands provided by the page itself in the IDE terminal.

Once all the previously tested resources have been created in development, we proceed to execute the following commands to link the source project to Firebase.

```bash
firebase init
```

We enabled continuous integration with the repository and selected Firebase hosting since this will serve the purpose of deploying the frontend.

For continuous integration, we had to create a firebase-hosting.yml file, inserting code and logic to authenticate and validate the service that Firebase attempts to request from GitHub to collect the relevant data from the repository and perform the deployment.

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

You need to generate a secret key at console firebase page in project configuration, it results in a file .json format that need the ```firebase.json``` reference for github