function T({ color, angle }) {
    if (angle === '0deg')
        return [
            [color, color, color],
            ['-', color, '-'],
        ]
    if (angle === '90deg')
        return [
            ['-', color],
            [color, color],
            ['-', color],
        ]
    if (angle === '180deg')
        return [
            ['-', color, '-'],
            [color, color, color],
        ]
    if (angle === '270deg')
        return [
            [color, '-'],
            [color, color],
            [color, '-'],
        ]
}
export default T
