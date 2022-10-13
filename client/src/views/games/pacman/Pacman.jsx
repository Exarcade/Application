import axios from 'axios'
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SocketContext from '../contexts/SocketContext'
import PacmanPlayer from './entities/PacmanPlayer'

import './styles/pacman.css'

const ipAddress = 'localhost'

function Pacman() {
    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const [amountOfPlayers, setAmountOfPlayers] = useState(0)
    const isFirstExecution = useRef(true)

    document.title = 'EXARCADE | PACMAN'

    const generatePlayers = (amount) => {
        const players = []
        for (let i = 1; i <= amount && i <= 2; i++) players.push(<PacmanPlayer key={players.length} playerNumber={i} />)
        return players
    }

    useEffect(() => {
        if (isFirstExecution.current) {
            axios.get(`http://${ipAddress}:3000/api/clients`).then((res) => {
                setAmountOfPlayers(res.data.amount)
                isFirstExecution.current = false
            })
            socket.emit('game', { name: 'pacman' })
        }
        const onNewPlayer = () => {
            if (amountOfPlayers < 4) {
                setAmountOfPlayers(amountOfPlayers + 1)
            }
        }
        socket.on('newPlayer', onNewPlayer)
        socket.on('action', (action) => {
            if (action.type === 'Select') {
                navigate('/')
            }
        })
        socket.on('direction', (direction) => {
            const event = new CustomEvent('direction', { detail: direction })
            document.dispatchEvent(event)
        })
        return () => {
            socket.off('newPlayer')
            socket.off('direction')
            socket.off('action')
        }
    })

    return <div className="pacman">{generatePlayers(amountOfPlayers)}</div>
}

export default Pacman
