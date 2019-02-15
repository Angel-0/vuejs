console.log('\n\n- - - - - - - - - - - - - - - - - - -')
console.log('-> Starting server.js at port '+process.env.SRV_PORT+'...')
// Dependencies importing
console.log("  |_ Importing dependencies")
const express = require('express')
const socketio = require('socket.io')
const dateformat = require('dateformat')
const Parser = require('rss-parser')

// Dependencies initialisation
console.log("  |_ Initialising dependencies")
const app = express()
const parser = new Parser()


// Dependencies initialisation
app.use(express.static('./public'))

const appserver = app.listen(process.env.SRV_PORT, () => { console.log('\n-> Server has started @ http://localhost:'+process.env.SRV_PORT+"\n\n") })
const ioserver = socketio(appserver, {
  pingTimeout: 2500,
  pingInterval: 10000
})

// Server logic
const query = {
  //        ms     sec  min
  interval: 1000 * 60 * 60,
  url: 'https://store.steampowered.com/feeds/daily_deals.xml'
}

function run () {
  (async () => {
 
    let feed = await parser.parseURL(query.url);
    console.log(feed.title);
   
    feed.items.forEach(item => {
      console.log(item.title + ':' + item.link)
    });
   
  })();
}

run()
setInterval(()=>{run()}, query.interval)


// 
// On socket connect
// 
ioserver.on('connection', (socket) => {
  sendMsgStack([
    '+ Socket connection established',
    ['Socket ID', socket.id],
    ['Client IP', socket.handshake.address]
  ])





  // 
  // On socket disconnect
  // 
  socket.on('disconnect', (reason) => {
    sendMsgStack([
      '- Socket connection dropped',
      ['Socket ID', socket.id],
      ['Disconnected for', reason]
    ])
  })

  // 
  // On socket error
  // 
  socket.on('error', (error) => {
    sendMsgStack([
      '! Error encountered on socket',
      ['Socket ID', socket.id],
      ['Error', error]
    ])
  })
})