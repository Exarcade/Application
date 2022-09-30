import { BrowserRouter, Routes, Route } from 'react-router-dom'

import io from 'socket.io-client'

import Game from './views/games/Game'
import Games from './views/games/Games'
import Home from './views/home/Home'
import Settings from './views/settings/Settings'

const socket = io()

function App() {
    socket.on('action', (type) => {
        const actionEvent = new CustomEvent('action', { detail: { type } })
        document.dispatchEvent(actionEvent)
    })
    socket.on('direction', (orientations) => {
        const directionEvent = new CustomEvent('direction', { detail: { orientations } })
        document.dispatchEvent(directionEvent)
    })

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="settings" element={<Settings />} />
                <Route path="games" element={<Games />} />
                <Route path="games/:game" element={<Game />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
