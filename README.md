# node-mongodb-embedded-documents
A basic and lean recipe for creating a nested collection in MongoDB using 
Mongoose.

This script will connect to the local mongod server and create a new table 
inside <strong><code>local</code></strong> called 
<strong><code>employees</code></strong>.


Requirements
-
You will need a running MongoDB daemon.


To install
-
```
$ git clone https://github.com/thenodeguy/node-mongodb-embedded-documents.git
$ cd node-mongodb-embedded-documents
$ npm install
```


To run
-
```
$ npm start
```


To test in the mongo shell:
-
```
$ mongo
$ use local
$ db.employees.find().pretty()
```
