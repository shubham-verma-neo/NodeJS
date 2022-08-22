console.log('Before');
// getUser(1, function(user){
//     console.log('User', user);

//     getRepo(user.gitHubName, (repo) => {
//         console.log('Repos: ', repo);
//     });
// });

async function display() {
    // const user = await getUser(1);
    // const userRepo = await getRepo(user.gitHubName);
    // console.log(userRepo);

    try{
        const user = await getUser(1);
        const userRepo = await getRepo(user.gitHubName);
        console.log(userRepo);
    }
    catch (err){
        console.log(err.message);
    }

}

display();

console.log('After');


function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Inside User..');
            resolve({ id: id, gitHubName: 'shubham' });
        }, 2000);
    })
}

function getRepo(userName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Inside Repo..');
            // resolve ({ user: userName, repo: ['repo1', 'repo2', 'repo3'] })
            reject(new Error('message'));
        }, 2000);
    })
}
////////// Callback \\\\\\\\\\
// function getUser(id, callback){
//     setTimeout(() => {
//         console.log('Inside User..');
//         callback ({id: id, gitHubName: 'shubham'});
//     }, 2000);
// }

// function getRepo(userName, callback){
//     setTimeout(() => {
//         console.log('Inside Repo..');
//         callback({user: userName, repo: ['repo1', 'repo2', 'repo3']})
//     }, 2000);
// }