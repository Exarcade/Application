import { useRef, useState, useEffect, useContext } from 'react'

import GameZone from './entities/GameZone'

import SocketContext from '../contexts/SocketContext'

import './styles/tetris.css'
import { useNavigate } from 'react-router-dom'

function Tetris() {
    const isFirstRendering = useRef(true)
    const [matrixColor, setMatrixColor] = useState('red')

    const socket = useContext(SocketContext)

    const navigate = useNavigate()

    document.title = 'EXARCADE | TETRIS'

    useEffect(() => {
        const switchMatrixColor = () => {
            if (matrixColor === 'red') setMatrixColor('blue')
            else setMatrixColor('red')
        }

        if (isFirstRendering.current) {
            let startGame = new CustomEvent('startGame', { detail: { playerNumber: 1 } })
            document.dispatchEvent(startGame)
            startGame = new CustomEvent('startGame', { detail: { playerNumber: 2 } })
            document.dispatchEvent(startGame)
            startGame = new CustomEvent('startGame', { detail: { playerNumber: 3 } })
            document.dispatchEvent(startGame)
            startGame = new CustomEvent('startGame', { detail: { playerNumber: 4 } })
            document.dispatchEvent(startGame)
            isFirstRendering.current = false
            document.getElementsByClassName('tetris')[0].click()

            socket.on('direction', (direction) => {
                if (direction.type === 'push') {
                    const directionEvent = new CustomEvent('direction', { detail: direction })
                    document.dispatchEvent(directionEvent)
                }
            })
            socket.on('action', (action) => {
                if (action.type === 'Select') {
                    navigate('/')
                }
                const directionEvent = new CustomEvent('action', { detail: action })
                document.dispatchEvent(directionEvent)
            })
            socket.emit('game', { name: 'tetris' })
        }
        setTimeout(switchMatrixColor, 5000)
    })

    return (
        <div className={'tetris ' + matrixColor}>
            <GameZone color={matrixColor} />
        </div>
    )
}

export default Tetris
