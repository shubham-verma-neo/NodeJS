const p = new Promise((resolve, reject) => {
    //async wrk
    setTimeout(() => {
        // resolve(1);
        reject(new Error('This is Error.'));
    }, 2000);
});

p
    .then(result => console.log('Result: ', R=result))
    .catch(err => console.log('Error: ', err.message));