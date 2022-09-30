import Player from './Player'

function GameZone() {
    return (
        <div className="game">
            <Player playerNumber={1} />
            <Player playerNumber={2} />
            <Player playerNumber={3} />
            <Player playerNumber={4} />
        </div>
    )
}

export default GameZone
