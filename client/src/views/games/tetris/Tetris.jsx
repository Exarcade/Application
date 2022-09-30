import { useRef, useState, useEffect } from 'react'

import GameZone from './entities/GameZone'

import theme from './theme.mp3'

import './styles/tetris.css'

function Tetris() {
    const isFirstRendering = useRef(true)
    const isMusicPlaying = useRef(false)
    const [matrixColor, setMatrixColor] = useState('red')

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
        }
        if (!isMusicPlaying.current) {
            const audio = new Audio(theme)
            audio
                .play()
                .then(() => (isMusicPlaying.current = true))
                .catch(null)
        }
        setTimeout(switchMatrixColor, 5000)
    })

    return (
        <div className={'tetris ' + matrixColor}>
            <GameZone />
        </div>
    )
}

export default Tetris
