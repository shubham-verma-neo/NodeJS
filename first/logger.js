const EventEmitter = require('events') 


var url = 'http://mylogger.io/log';
class Logger extends EventEmitter{

    log(msg){
        // Send HTTP req to server
        console.log(msg);
        // Raise a event
        this.emit('msgLogged', {id: 1, url: 'http://'}) // signaling that an event 
    }
}


module.exports = Logger;