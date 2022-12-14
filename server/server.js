const express = require('express')
const app = express()
var path = require('path')
const cors = require('cors')
const http = require('http')
const httpServer = http.createServer(app)

const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
    },
})

const { exec } = require('child_process')

app.use(express.json())
app.use(
    cors({
        origin: '*',
    })
)

let currentLightStatus = true
// app.use(express.static('../client/build'))

app.get('/api/clients', (req, res) => {
    let clients = Array.from(io.sockets.adapter.rooms.get('clients') ?? [])
    res.json({ clients: clients, amount: clients.length })
})

app.get('/api/servers', (req, res) => {
    let clients = Array.from(io.sockets.adapter.rooms.get('servers') ?? [])
    res.json({ servers: clients, amount: clients.length })
})

app.get('/api/lights', (req, res) => {
    const status = currentLightStatus
    res.json({ status })
})

app.post('/api/lights', (req, res) => {
    const { status } = req.body
    if (status === true) {
        exec('sudo uhubctl -l 1-1 -a 1')
    } else {
        exec('sudo uhubctl -l 1-1 -a 0')
    }
    io.to('clients').emit('lights_update', status)
    res.json({ status })
})

app.get('/api/sounds/tetris', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'tetris-theme.mp3'))
})
app.get('/api/sounds/pacman', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pacman-theme.mp3'))
})

app.get('*.*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', req.url))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
})

io.on('connection', function (newSocket) {
    newSocket.on('server', function () {
        newSocket.join('servers')

        newSocket.on('game', function ({ name }) {
            io.to('clients').emit('sound', name)
        })
    })

    newSocket.on('client', function () {
        newSocket.join('clients')

        io.to('servers').emit('newPlayer')

        newSocket.on('direction', (direction) => {
            const clients = Array.from(io.sockets.adapter.rooms.get('clients') ?? [])
            const playerNumber = clients.indexOf(newSocket.id) + 1
            io.to('servers').emit('direction', { ...direction, player: playerNumber })
        })
        newSocket.on('action', (action) => {
            const clients = Array.from(io.sockets.adapter.rooms.get('clients') ?? [])
            const playerNumber = clients.indexOf(newSocket.id) + 1
            io.to('servers').emit('action', { ...action, player: playerNumber })
        })
    })

    newSocket.on('disconnecting', () => {
        newSocket.leave('servers')
        newSocket.leave('clients')
    })
})

httpServer.listen(3000, function () {
    console.log('listening on *:3000')
})
