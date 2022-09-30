const express = require('express')
const app = express()
var path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let appSocket = null

const servers = []
const clients = []

app.use(express.json())
app.use(express.static('client/build'))
// app.use(express.urlencoded())

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
})

// app.post('/api/direction', (req, res) => {
//     const { orientations } = req.body
//     if (appSocket != null) {
//         appSocket.emit('direction', orientations)
//     }
//     res.send('success')
// })

// app.post('/api/action', (req, res) => {
//     const { type } = req.body
//     if (appSocket != null) {
//         appSocket.emit('action', type)
//     }
//     res.send('success')
// })

io.on('connection', function (newSocket) {
    newSocket.on('server', function (socket) {
        servers.push(socket)
    })

    newSocket.on('player', function (socket) {
        clients.push(socket)
        socket.on('direction', (direction) => {
            servers.emit('direction', direction)
        })
        socket.on('action', (action) => {
            servers.emit('action', action)
        })
    })

    newSocket.on('disconnect', (socket) => {
        if (clients.includes(socket)) clients.splice(clients.indexOf(socket), 1)
        if (servers.includes(socket)) servers.splice(servers.indexOf(socket), 1)
    })
})

http.listen(3000, function () {
    console.log('listening on *:3000')
})
