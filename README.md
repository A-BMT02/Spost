# Spost

Organize your content in one place and post to all your social media profiles in one click

## 👨‍💻 Demo

Explore the app functionality [here](https://spostapp.vercel.app/).


https://user-images.githubusercontent.com/30394037/195150562-05f7a1a8-25f9-4a60-bbc8-21a3cd4b3415.mp4



### ✏️ Design File

Interested in the design of this app? Check out the [Figma file](https://www.figma.com/file/2JsajIjbelWdCUCkkvTyJm/Untitled?node-id=0%3A1).

### ⚒️ Technologies Used

This project was built using the following technologies:

- React
- NodeJS
- ExpressJS
- MongoDB
- Tailwind

### Folder structure

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

### 👇 Prerequisites

To get this project up and running locally, you must already have installed the following packages on your computer.

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

### 🛠️ Contribution Guidelines

Want to contribute to this project? Follow the steps below to set up the project locally.

1. Fork this repository.
2. Clone your forked repository to your local machine.

```
git clone https://github.com/<your-github-username>/spost.git
```

3. Navigate to the project directory:

```
cd spost
```

4. Navigate to the frontend directory

```
cd client
```

5. Install the dependencies:

```
npm install
```

6. Navigate to the backend directory

```
cd backend
```

7. Install the dependencies:

```
npm install
```

5. Create a new branch:

```
git checkout -b <your-branch-name>
```

At this point, you can now modify existing files or add new files to the project on your own branch.

6. Stage your changes and commit

Once you have modified existing files or added new files to the project, you can add them to your local repository, which you can do with the `git add` command.

_Add changes_

```
git add .
```

_Commit changes_

```
git commit -m "commit message"
```

7. Push your changes to GitHub:

```
git push -u origin <your-branch-name>
```

# ❗ Reminder

Dont forget to drop a star ✨ while you're here
