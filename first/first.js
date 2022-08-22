////////// Module Import \\\\\\\\\\\\

// const logger = require('./logger');

// console.log(logger);

////////// PATH \\\\\\\\\\\\

// const path = require('path');

// var pathOj= path.parse(__filename);

// console.log(pathOj);
// console.log(path);

////////// OS \\\\\\\\\\\\

// const os = require('os')

// var totalMem = os.totalmem()
// var freeMem = os.freemem()

// console.log(`Total ${totalMem}`)
// console.log(`Total ${freeMem}`)

////////// fS \\\\\\\\\\\\

// const fs = require('fs')

// const filesSync = fs.readdirSync('./');
// console.log(filesSync);

// fs.readdir('./', (err, res) => {
//     if(err) console.log('Error', err)
//     else console.log('Result', res)
// })

////////// Extending EventEmitter \\\\\\\\\\\\

// const EventEmitter = require('events') //  class // EventEmiiter 1st letter is capital because it is a convention it is class

// const Logger = require('./logger')
// const logger = new Logger();

// // Register a listener // order matter we need to add listener first
// // emitter.addListener() // we have alice for 'addListener' is 'on' both will be same
// logger.on('msgLogged', (arg) => {
//     console.log('Caller Logged', arg);
// })


// logger.log('message')

////////// HTTP \\\\\\\\\\\\

const http = require('http')

const server = http.createServer((req, res) => {
    if(req.url == '/'){
        console.log('Hello World..')
        res.write(JSON.stringify([1,2,3,4])) // JSON.stringify will convert array to string
        res.end();
    }
});

server.on('connection', (socket) => {
    console.log('New Connection');
});

server.listen(3000);

