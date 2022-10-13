# Table of Content

- [Introduction](#introduction)
  - [Demo](#demo)
  - [Design file](#design-file)
  - [Technologies used](#technologies-used)
- [Folder structure](#folder-structure)
- [File structure](#file-structure)
- [Starting the project](#starting-the-project)
  - [Prerequisites](#prerequisites)
  - [Fork repository](#fork-repository)
  - [Clone repository](#clone-repository)
  - [Start client](#start-client)
  - [Start server](#start-server)
- [How to debug](#how-to-debug)
- [Tests](#tests)
- [Typescript](#typescript)
- [Contributing](#contributing)

## Introduction

Spost is a web application that allows you to organize your content in one place and post to all your social media profiles in one click

### Demo

Explore the app functionality [here](https://spostapp.vercel.app/).


https://user-images.githubusercontent.com/30394037/195150562-05f7a1a8-25f9-4a60-bbc8-21a3cd4b3415.mp4



###  Design File

Interested in the design of this app? Check out the [Figma file](https://www.figma.com/file/2JsajIjbelWdCUCkkvTyJm/Untitled?node-id=0%3A1).

### Technologies Used

This project was built using the following technologies:

- React
- NodeJS
- ExpressJS
- MongoDB
- Tailwind

## Folder structure
The frontend is built using React and broken down into components. CRUD operations are done based on the users interaction with the UI. CRUD operations are done in the NodeJS/ExpressJs server which is broken down into routes and controllers. The data is stored in a MongoDB and mongoose is used to interact between the server and the Database(MongoDB)

The basic working flow of the app could be illustrated in the following diagram.

![image](https://user-images.githubusercontent.com/30394037/195169065-06fbd8e0-d4cd-4b4a-81ab-5598398a669a.png)


## File structure

```
├── client                   // client folder as a create-react-app
|   |
|   ├── cypress              // end-to-end tests using cypress
|   ├── build                // output from build for website
|   ├── node_modules         // npm dependencies for website code
|   ├── public               // static assets that will be used to build website
|   ├── src                  // view layer code of the website
|   |   ├── context          // context for storing global data
|   |   ├── pages            // website pages frontend implemetation
|   |   ├── components       // small components used in pages directory
|   |   ├── images           // all images used in frontend implemetation
|   |   ├── utilities        // utility functions including reducer
|   |   ├── App.js           // entry point of the website
|   |   ├── index.js         // rendering whole website
|   |   └── index.css        // styles for index.js and taiwind utilities imported
|   ├── cypress.config.js    // config for end-to-end tests
|   ├── package.json         // npm dependencies and build scripts for website
|   ├── postcss.config.js    // transform styles
|   ├── tailwind.config.js   // tailwind config file
|   ├── vercel.json          // vercel config file
|   └── package.lock.json    // config settings for compiling website
├── backend                  // all of the source code for server
|   ├── middleware           // auth middleware
|   ├── routes               // server routing configurations
|   ├── models               // mongoDb schema
|   ├── config               // passportJs config
|   ├── utils                // server utility functions
|   ├── procfile             // commands run on start
|   ├── package.json         // npm dependencies and build scripts for ser er
|   ├── package.lock.json    // config settings for compiling server 
|   └── server.js            // entry point of server
```

## Starting the project

Follow the instructions below to set up the project in your local environment


###  Prerequisites

To get this project up and running locally, you must already have installed the following packages on your computer.

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

### Fork repository
 - Click [here](https://github.com/A-BMT02/spost/fork) to fork the repository or click on the fork icon at the top right 

### Clone repository
- Clone your forked repository to your local machine: ```git clone https://github.com/<your-github-username>/spost.git```

### Start client 
- Navigate to the project directory: ```cd spost```

- Navigate to the frontend directory: ```cd client```

- Install the dependencies: ```npm install```

- Run client: ```npm start```

### Start server

- Navigate to the backend directory: ```cd backend```

- Install the dependencies: ```npm install```

- Run server: ```node server```

## How to debug
If you are only changing the client folder, you can go ahead and start making changes directly. If you are changing the backend folder, change all instance of 'https://web-production-191a.up.railway.app' to the address of the local server. i.e if the server is running on port 5000, use 'http://localhost:5000'

## Tests
Follow the steps below to set up the tests environment
- Make sure you run ``` npm install ``` to install all dependencies before running tests.
- Change directory to the client folder ``` cd client ```
- Run ```npx cypress open``` . If cypress is not installed in your local environment, you will be prompted to install it. Follow the instructions provided to install cypress. After installation, Cypress will automatically open
- Click on E2E testing and follow the prompts presented. 
- Select the tests to run


https://user-images.githubusercontent.com/30394037/195203053-bb314401-3543-4fb6-9552-a01c77ad94d3.mp4

## Typescript
This project is being converted to Typescript in the [Typescript branch](https://github.com/A-BMT02/spost/tree/typescript)

## Contributing

After making changes, follow the steps below to create a pull request

- Create a new branch: ```git checkout -b <your-branch-name>```

- Stage your changes and commit: ```git add .``` 

- Commit changes: ```git commit -m "commit message"```

- Push your changes to GitHub: ```git push -u origin <your-branch-name>```

# Support

Dont forget to drop a star ✨ while you're here
