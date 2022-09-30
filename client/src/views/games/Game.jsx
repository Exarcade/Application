import { createContext } from 'react'
import { useParams } from 'react-router-dom'

import { io } from 'socket.io-client'

import Tetris from './tetris/Tetris'

const socket = io()

function Game() {
    const SocketContext = createContext(socket)

    const { game } = useParams()
    switch (game) {
        case 'tetris':
            return (
                <SocketContext.Provider value={socket}>
                    <Tetris />
                </SocketContext.Provider>
            )
        default:
            return <div>Unknown Game</div>
    }
}
export default Game
