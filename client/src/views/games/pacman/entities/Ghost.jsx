function Ghost({ color = 'red', isVulnerable }) {
    return (
        <div className={'ghost' + (isVulnerable ? ' isVulnerable' : '')} style={{ backgroundColor: color }}>
            <div className="eyes">
                <div className="eye">
                    <div className="pupil"></div>
                </div>
                <div className="eye">
                    <div className="pupil"></div>
                </div>
            </div>
            <div className="skirt"></div>
        </div>
    )
}

export default Ghost
