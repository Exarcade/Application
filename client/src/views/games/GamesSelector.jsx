import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SocketContext from './contexts/SocketContext'

import logo from './icons/logo.png'

import './styles/games.css'

function GamesSelector() {
    const socket = useContext(SocketContext)

    const navigate = useNavigate()

    const [selection, setSelection] = useState(0)

    document.title = 'EXARCADE | SELECTION'

    useEffect(() => {
        socket.on('direction', ({ orientations, type }) => {
            if (type === 'push') {
                if (orientations.includes('right')) {
                    setSelection((selection + 1) % 2)
                }
                if (orientations.includes('left')) {
                    let val = selection - 1
                    if (val < 0) val = 1
                    setSelection(val)
                }
            }
        })
        socket.on('action', ({ type }) => {
            if (type === 'A') {
                const game = document.getElementsByClassName('selector')[0].getElementsByClassName('selected')[0].id
                navigate('/game/' + game)
            }
        })
        return () => {
            socket.off('direction')
            socket.off('action')
        }
    })

    return (
        <div className="games">
            <div className="title">
                <img src={logo} alt="logo" />
            </div>
            <div className="selector">
                <div className={'game' + (selection === 0 ? ' selected' : '')} id="tetris"></div>
                <div className={'game' + (selection === 1 ? ' selected' : '')} id="pacman"></div>
            </div>
        </div>
    )
}

export default GamesSelector
