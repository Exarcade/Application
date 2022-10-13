import { useParams } from 'react-router-dom'

import { defaultSocketValue, SocketProvider } from './contexts/SocketContext'
import Pacman from './pacman/Pacman'

import Tetris from './tetris/Tetris'

function Game() {
    const { game } = useParams()

    const gameSelector = () => {
        switch (game) {
            case 'tetris':
                return (
                    <SocketProvider value={defaultSocketValue}>
                        <Tetris />
                    </SocketProvider>
                )
            case 'pacman':
                return (
                    <SocketProvider value={defaultSocketValue}>
                        <Pacman />
                    </SocketProvider>
                )
            default:
                return <div>Unknown Game</div>
        }
    }

    return <SocketProvider value={defaultSocketValue}>{gameSelector()}</SocketProvider>
}
export default Game
