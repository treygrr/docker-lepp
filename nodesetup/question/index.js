const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve, reject) => {
        readLine.question(question+ ': \n', (answer) => resolve(answer)||reject('Oops'))
    })
}

function exit() {
    return new Promise((resolve, reject) => {
        readLine.close()
    })
}


module.exports = { ask, exit }