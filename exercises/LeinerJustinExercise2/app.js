/* const fs = require('fs');
const http = require('http');
const port = 8080;

const host = 'localhost';
const server = http.createServer((req, res)=>{

res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');

let path = '/Users/justinleiner/Documents/ITIS-4166/exercises/LeinerJustinExercise2/view/';

if(req.url === '/contact') {
    path = path + 'contact.html';
}else if(req.url === '/about') {
    path = path + 'about.html';
}else {
    res.statuscode = 404;
    path = path + '404.html';
}

fs.readFile(path, (err,data) => {
    if (err) {
        console.log(err);
        res.end();
        }else{
            res.write(data);
            res.end();
        }
    });

});

server.listen(port, host, () =>{
    console.log('Server is on port', port)
});

*/

const express = require('express');

const app = express();
let port = 3000;
let host = 'localhost';

let students = [{id: 1, name: 'Taylor', major: 'Jorunalism'},{id: 2, name: 'Omar', major: 'Communications'},{id: 3, name: 'Ayan', major: 'Finance'}];

app.use(express.static('styles'));

app.use((req, res, next)=> {
    console.log(req.method);
    console.log(req.url);
    next();
})

app.use((req, res, next)=> {
    console.log("This is the second middleware function");
    next();
})

app.get('/', (req, res) => {
    
    console.log(req.url);
    console.log(res.query);
    res.sendFile('./view/index.html',{root: __dirname} );
});

app.get('/students', (req, res) => {
    res.json(students);
})



app.get('/students/:sid', (req, res) => {
    console.log(req.params);
    let id = req.params.sid;
    let student = students.find(element => element.id === parseInt(id));
    console.log(student);
    
    res.json(student);
});

app.get('/about', (req, res) => {
    res.send('About Page');
});

app.use((req, res, next) =>{
    res.status(400).send('Page cannot be found');
})

app.listen(port, host, () =>{
    console.log("The Server is running at port", port);
});



