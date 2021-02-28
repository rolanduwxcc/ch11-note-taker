//----------------------------------------------MODULES
const express = require('express');  //express.js
const fs = require('fs');   //file system module
const path = require('path')   //path module
const logger = require('./middleware/logger'); 


//-----------------------------------------------VARIABLES
const PORT = process.env.PORT || 3001;  //port used
const app = express();  //instantiates the server

//---------------------MIDDLEWARE-------------MIDDLEWARE
//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Set static folder, basically make all html public
app.use(express.static(path.join(__dirname,'public')));

//----moved the main routes to own folder
app.use('/api/notes', require('./routes/api/notes.js'));

app.use(logger);



app.listen(PORT, () => {
    console.log(`Note API server running on port ${PORT}!`);
});