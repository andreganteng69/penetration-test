const { parentPort } = require('worker_threads')
const { HttpProxyAgent } = require('http-proxy-agent');
const { HeaderGenerator } = require('header-generator');

let headerGenerator = new HeaderGenerator({
        browsers: [
            {name: "firefox", minVersion: 80},
            {name: "chrome", minVersion: 87},
            "safari"
        ],
        devices: [
            "desktop"
        ],
        operatingSystems: [
            "windows"
        ]
});

parentPort.on("message", val => {
    const [ url, _proxy ] = val.split("<>")
    const headers = headerGenerator.getHeaders({
        operatingSystems: [
            "linux"
        ],
        locales: ["en-US", "en"]
    });
    headers['referer'] = 'https://google.com'
    headers['x-forwarded-for'] = _proxy.split(':')[0]
    const proxy = new HttpProxyAgent("https://" + _proxy)
    const controller = new AbortController
    fetch(url, {
        method: "GET",
        headers, agent: proxy,
        signal: controller.signal
    }).catch(()=>{})
    setTimeout(()=>controller.abort(),600)
})