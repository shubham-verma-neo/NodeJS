// const p = Promise.resolve({id: 1});
// const p1 = Promise.reject(new Error('this is reason...'));
// p.then(result => console.log('Result: ',result));
// p1.catch(err => console.log('Error: ', err));


////// Multiple Promises \\\\\\\\

const p1= new Promise((resolve) => {
    setTimeout(()=> {
        console.log('operation 1.....');
        resolve(1);
    }, 2 * 1000);
});


const p2= new Promise((resolve, reject) => {
    setTimeout(()=> {
        console.log('operation 2.....');
        // resolve(2);
        reject(new Error('rejected'));
    }, 2 * 1000);
});

// Promise.all([p1, p2])  // if any of promise is rejected Promise all is rejected
//     .then(result => console.log('Result: ', result))
//     .catch(err => console.log(err.message));

    Promise.race([p1, p2])  // value of 1st fulfill promise
    .then(result => console.log('Result: ', result))
    .catch(err => console.log(err.message));