# srt-translator
web app for learning English by using srt-files

### Installation

1. Required [MongoDB 3.2](https://docs.mongodb.org/manual/installation/), [Node.js](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/).
2. Prepare DB: mongoimport --db engRusDictionary --collection dictionary --file data/dict.json;
3. Install dependencies: npm install;
4. Run mongod: mongod --dbpath data/;
5. Run app: node app.js;
6. Test app: [http://localhost:3000]
