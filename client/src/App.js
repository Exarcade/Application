import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { defaultSocketValue, SocketProvider } from './views/games/contexts/SocketContext'

import Game from './views/games/Game'
import GamesSelector from './views/games/GamesSelector'
import Settings from './views/settings/Settings'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <SocketProvider value={defaultSocketValue}>
                            <GamesSelector />
                        </SocketProvider>
                    }
                />
                <Route path="settings" element={<Settings />} />
                <Route path="/game/:game" element={<Game />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
