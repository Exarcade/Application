function Texture(props) {
    return <div style={{ backgroundColor: props.color ?? 'transparent' }} className="texture" alt={props.color + '-texture'} />
}

export default Texture
