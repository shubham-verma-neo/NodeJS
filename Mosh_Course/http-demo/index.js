//////////// w/o Express \\\\\\\\\\\\\
/*
const http = require('http')

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        res.write('Hello World!')
        res.end()
    }
})

const port = 3000;
server.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
*/
//////////// with Express \\\\\\\\\\\\\

const startupDebugger= require('debug')('app:startup'); 
const db= require('debug')('app:db'); 
const config= require('config');
const morgan= require('morgan');
const helmet= require('helmet');
const logger= require('./middleware/logger');
const courses= require('./routes/courses');
const home= require('./routes/home');
const express = require('express');
const app = express();

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

//Configuration
// console.log('Application Name: ' + config.get('name'));
// console.log('Mail Server: ' + config.get('mail.host'));


// app.set('view engine', 'pug');
// app.set('views', './views');

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('morgan is enable..');
}
app.use(logger);

app.use('/api/courses', courses);
app.use('/', home);


// app.get('/', (req, res) => {
//     res.render('index',{title: 'My Express App', message: 'Hello World!'});
// });


const port = process.env.PORT || 3000 ;
app.listen(port, () => {
    console.log(`Listening to port ${port}..`);
});

