# Vidly Movie Rental Service using NodeJS
This is the backend service for a movie rental service called "Vidly" programmed using nodejs as my first project in nodejs. 

* [ExpressJS](https://expressjs.com/) based web server.
* [MongoDB](https://www.mongodb.com/) as the database service with the help of the popular package [mongoose](https://mongoosejs.com/).
* Input validation using [Joi](https://joi.dev/)
* Authentication and authorization services using JSON web tokens.
* Error handling and user friendly feedback.
* Logging using [winston](https://github.com/winstonjs/winston).

## How to Run
You can run this project localy if you have nodejs installed and have a mongodb server locally or on cloud.
* Clone the repository and go inside the folder
```
git clone https://github.com/mohotta/vidly
cd vidly
```
* Install dependencies
```
npm install
```
* Install nodemon for interactive experience (optional)
```
npm install -g nodemon
```
* export application configurations as env variables.
```
export vidly_APP_DB_URL=<DB_URL>
export vidly_APP_JWT_KEY=<JWT_PRIVATE_KEY>
export vidly_APP_PORT=<PORT_NO>
```
&nbsp;&nbsp; Or you can use `.json` config files. [Guide](https://github.com/node-config/node-config)
* Run the project
```
node index.js
```
* If nodemon installed
```
nodemon index.js
```

## Project Structure

    ├── models         # Mongoose models and Joi validations for documents used in the project
    │   ├── ...
    │   ├── ...
    │   └── ...  
    ├── routes         # Functions handling eah endpoint of the application
    │   ├── ...
    │   ├── ...
    │   └── ...  
    ├── services
    │   ├── db         # Interactions with the database
    │       ├── ...
    │       ├── ...
    │       └── ...  
    ├── tests          # Test scripts
    ├── utils          # Utility functions
    │   └── utils.js  
    ├── index.js       # main file of the project
    ├── .env.template  # .env file template
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    └── README.md
