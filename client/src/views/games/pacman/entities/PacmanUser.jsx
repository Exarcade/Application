function PacmanUser({ translation, orientation, canEatGhost }) {
    return (
        <div id="pacman" className={(translation ? 'translation ' + translation : '') + ' orientation-' + orientation + (canEatGhost ? ' isInvicible' : '')}>
            <div className="mouth"></div>
        </div>
    )
}
export default PacmanUser
