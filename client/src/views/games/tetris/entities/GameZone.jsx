import axios from 'axios'
import { useContext, useEffect, useRef, useState } from 'react'
import SocketContext from '../../contexts/SocketContext'

import Player from './Player'

const ipAddress = 'localhost'

function GameZone(props) {
    const [amountOfPlayers, setAmountOfPlayers] = useState(0)
    const isFirstExecution = useRef(true)

    const socket = useContext(SocketContext)

    const generatePlayers = (amount) => {
        const players = []
        for (let i = 1; i <= amount; i++) players.push(<Player key={players.length} playerNumber={i} color={props.color} />)
        return players
    }

    useEffect(() => {
        if (isFirstExecution.current) {
            axios.get(`http://${ipAddress}:3000/api/clients`).then((res) => {
                setAmountOfPlayers(res.data.amount)
                isFirstExecution.current = false
            })
        }
        const onNewPlayer = () => {
            if (amountOfPlayers < 4) {
                setAmountOfPlayers(amountOfPlayers + 1)
            }
        }
        socket.on('newPlayer', onNewPlayer)
        return () => socket.off('newPlayer')
    }, [amountOfPlayers, socket])

    return <div className="game">{generatePlayers(amountOfPlayers)}</div>
}

export default GameZone
