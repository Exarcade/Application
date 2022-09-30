function Z({ color, angle }) {
    if (angle === '0deg' || angle === '180deg')
        return [
            [color, color, '-'],
            ['-', color, color],
        ]
    if (angle === '90deg' || angle === '270deg')
        return [
            ['-', color, color],
            [color, color, '-'],
        ]
}
export default Z
