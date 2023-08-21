console.log('Before');
getUser(1, function(user){
    console.log('User', user);

    getRepo(user.gitHubName, (repo) => {
        console.log('Repos: ', repo);
    });
});
console.log('After');

function getUser(id, callback){
    setTimeout(() => {
        console.log('Inside User..');
        callback ({id: id, gitHubName: 'shubham'});
    }, 2000);
}

function getRepo(userName, callback){
    setTimeout(() => {
        console.log('Inside Repo..');
        callback({user: userName, repo: ['repo1', 'repo2', 'repo3']})
    }, 2000);
}