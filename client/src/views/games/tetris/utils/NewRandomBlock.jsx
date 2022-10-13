import I from '../entities/blocs/I'
import L from '../entities/blocs/L'
import LReverse from '../entities/blocs/LReverse'
import S from '../entities/blocs/S'
import Square from '../entities/blocs/Square'
import T from '../entities/blocs/T'
import Z from '../entities/blocs/Z'

function generateRandomBlock() {
    const randomBlockNumber = Math.floor(Math.random() * 7)
    const randomColorNumber = Math.floor(Math.random() * 6)
    const randomAngleNumber = Math.floor(Math.random() * 4)
    let angle = '0deg'
    switch (randomAngleNumber) {
        case 0:
            angle = '0deg'
            break
        case 1:
            angle = '90deg'
            break
        case 2:
            angle = '180deg'
            break
        default:
            angle = '270deg'
            break
    }

    let color = null
    switch (randomColorNumber) {
        case 0:
            color = 'blue'
            break
        case 1:
            color = 'red'
            break
        case 2:
            color = 'yellow'
            break
        case 3:
            color = 'orange'
            break
        case 4:
            color = 'lime'
            break
        default:
            color = 'purple'
            break
    }

    let randomBlock = null
    let generator = null
    switch (randomBlockNumber) {
        case 0:
            randomBlock = I({ color, angle })
            generator = I
            break
        case 1:
            randomBlock = L({ color, angle })
            generator = L
            break
        case 2:
            randomBlock = LReverse({ color, angle })
            generator = LReverse
            break
        case 3:
            randomBlock = S({ color, angle })
            generator = S
            break
        case 4:
            randomBlock = Square({ color })
            generator = Square
            break
        case 5:
            randomBlock = T({ color, angle })
            generator = T
            break
        default:
            randomBlock = Z({ color, angle })
            generator = Z
            break
    }
    return {
        angle: angle,
        block: randomBlock,
        color: color,
        generator: generator,
    }
}

export default generateRandomBlock
