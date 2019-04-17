// testing for serving the client page
const express = require('express')
const app = express()
const port = 3000;
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', function(req, res) {
    res.render('index'); // actually renders the page but sso isn't working not sure why
    // current error I'm on is
//     /Users/oliy/Desktop/Disbo/habbohtml/server/node_modules/mysql/lib/protocol/Parser.js:82
//         throw err;
//         ^
//
// TypeError: Cannot read property 'query' of undefined
//     at /Users/oliy/Desktop/Disbo/habbohtml/server/h5/networking/sso.js:28:5
//     at Handshake.onConnect [as _callback] (/Users/oliy/Desktop/Disbo/habbohtml/server/node_modules/mysql/lib/Pool.js:54:9)
//     at Handshake.Sequence.end (/Users/oliy/Desktop/Disbo/habbohtml/server/node_modules/mysql/lib/protocol/sequences/Sequence.js:96:24)
//     at Handshake.ErrorPacket (/Users/oliy/Desktop/Disbo/habbohtml/server/node_modules/mysql/lib/protocol/sequences/Handshake.js:103:8)
//     at Protocol._parsePacket (/Users/oliy/Desktop/Disbo/habbohtml/server/node_modules/mysql/lib/protocol/Protocol.js:274:23)
//     at Parser.write (/Users/oliy/Desktop/Disbo/habbohtml/server/node_modules/mysql/lib/protocol/Parser.js:77:12)
//     at Protocol.write (/Users/oliy/Desktop/Disbo/habbohtml/server/node_modules/mysql/lib/protocol/Protocol.js:39:16)
//     at Socket.<anonymous> (/Users/oliy/Desktop/Disbo/habbohtml/server/node_modules/mysql/lib/Connection.js:96:28)
//     at Socket.emit (events.js:197:13)
//     at addChunk (_stream_readable.js:288:12)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
