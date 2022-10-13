import React from 'react'
import { io } from 'socket.io-client'

const ipAddress = 'localhost'

const socket = io(`http://${ipAddress}:3000`)
const SocketContext = React.createContext(socket)
socket.emit('server')

export const defaultSocketValue = socket

export const SocketProvider = SocketContext.Provider

export default SocketContext
