import Texture from '../Texture'

function LReverse({ color, angle }) {
    if (angle === '0deg')
        return [
            ['-', color],
            ['-', color],
            [color, color],
        ]
    if (angle === '90deg')
        return [
            [color, '-', '-'],
            [color, color, color],
        ]
    if (angle === '180deg')
        return [
            [color, color],
            [color, '-'],
            [color, '-'],
        ]
    if (angle === '270deg')
        return [
            [color, color, color],
            ['-', '-', color],
        ]
    return (
        <div className="block" style={{ width: 3 * 24 }}>
            <div className="line">
                <Texture color={color} />
                <Texture color={color} />
                <Texture color={color} />
            </div>
            <div className="line">
                <Texture />
                <Texture />
                <Texture color={color} />
            </div>
        </div>
    )
}
export default LReverse
