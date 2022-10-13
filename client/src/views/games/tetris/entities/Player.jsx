import { useRef } from 'react'
import { useEffect, useState } from 'react'

import generateRandomBlock from '../utils/NewRandomBlock'

import Texture from './Texture'

function Player({ playerNumber, color }) {
    const defaultGrid = [
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ]

    const [blockOrigin, setBlockOrigin] = useState({ x: 4, y: 0 })
    const [currentBlock, setCurrentBlock] = useState(generateRandomBlock())
    const [nextBlock, setNextBlock] = useState(generateRandomBlock())
    const [grid, setGrid] = useState(defaultGrid)
    const [gameIsOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0)

    const isRunning = useRef(false)

    const useForceUpdate = () => {
        const [, setState] = useState()
        return () => setState({})
    }

    const forceUpdate = useForceUpdate()

    useEffect(() => {
        const onGameStart = ({ detail }) => {
            if (detail.playerNumber === playerNumber) {
                const { x, y } = blockOrigin
                currentBlock.block.forEach((column, indexY) => {
                    column.forEach((line, indexX) => {
                        grid[y + indexY][x + indexX] = line
                    })
                })
                setGrid(grid)
                forceUpdate()
            }
        }

        const onGameOver = ({ detail }) => {
            if (detail.playerNumber === playerNumber) {
                document.removeEventListener('startGame', onGameStart)
                document.removeEventListener('BlockPlaced', onBlockPlaced)
                document.removeEventListener('GameOver', onGameOver)
                setGameOver(true)
            }
        }

        const onBlockPlaced = ({ detail }) => {
            if (detail.playerNumber === playerNumber) {
                let newGrid = [...grid]
                setCurrentBlock(nextBlock)
                setNextBlock(generateRandomBlock())
                setBlockOrigin({ x: 4, y: 0 })
                nextBlock.block.forEach((column, indexY) => {
                    column.forEach((line, indexX) => {
                        newGrid[0 + indexY][4 + indexX] = line
                    })
                })
                grid.forEach((rows, index) => {
                    if (rows.filter((val) => val === '-' || val === 'brown').length === 0) {
                        newGrid[5] = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
                        newGrid.splice(index, 1)
                        newGrid.splice(5, 0, ['brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown'])
                        setScore(score + 1000)
                    }
                })
                setGrid(newGrid)
            }
        }
        document.addEventListener('startGame', onGameStart)
        document.addEventListener('BlockPlaced', onBlockPlaced)
        document.addEventListener('GameOver', onGameOver)
        return () => {
            document.removeEventListener('startGame', onGameStart)
            document.removeEventListener('BlockPlaced', onBlockPlaced)
            document.removeEventListener('GameOver', onGameOver)
        }
    })

    useEffect(() => {
        const removeCurrent = ({ x, y }) => {
            currentBlock.block.forEach((column, indexY) => {
                column.forEach((line, indexX) => {
                    if (line !== '-') {
                        if (y + indexY === 5) grid[y + indexY][x + indexX] = 'brown'
                        else grid[y + indexY][x + indexX] = '-'
                    }
                })
            })
        }

        const canMoveDown = () => {
            const { x, y } = blockOrigin
            const CannotMove = {}
            let canMoveDown = true
            try {
                currentBlock.block.forEach((column, indexY) => {
                    column.forEach((line, indexX) => {
                        if (line === '-') return
                        if (y + indexY + 1 > grid.length - 1) throw CannotMove
                        const current = grid[y + indexY][x + indexX]
                        const belowBlock = grid[y + indexY + 1][x + indexX]
                        let isNextBlockPartOfCurrent = false
                        try {
                            isNextBlockPartOfCurrent = currentBlock.block[indexY + 1][indexX] !== undefined
                            if (isNextBlockPartOfCurrent && (currentBlock.block[indexY][indexX] === '-' || currentBlock.block[indexY + 1][indexX] === '-')) throw CannotMove
                        } catch (ex) {
                            if (current !== 'brown' && current !== '-' && belowBlock !== 'brown' && belowBlock !== '-') throw CannotMove
                        }
                    })
                })
            } catch (ex) {
                canMoveDown = false
                return canMoveDown
            }
            return canMoveDown
        }

        const moveDown = () => {
            const { x, y } = blockOrigin
            removeCurrent(blockOrigin)
            currentBlock.block.forEach((column, indexY) => {
                column.forEach((line, indexX) => {
                    if (line === '-' && y + indexY + 1 === 5) {
                        grid[y + indexY + 1][x + indexX] = 'brown'
                    } else {
                        if (line !== '-') grid[y + indexY + 1][x + indexX] = line
                    }
                })
            })
            setGrid(grid)
            setBlockOrigin({ x: x, y: y + 1 })
        }

        const canMoveLeft = () => {
            const { x, y } = blockOrigin
            const CannotMove = {}
            try {
                currentBlock.block.forEach((column, indexY) => {
                    column.forEach((line, indexX) => {
                        if (x + indexX - 1 < 0) throw CannotMove
                        const current = grid[y + indexY][x + indexX]
                        const belowBlock = grid[y + indexY][x + indexX - 1]
                        let isNextBlockPartOfCurrent = false
                        try {
                            isNextBlockPartOfCurrent = currentBlock.block[indexY][indexX - 1] !== undefined
                            if (!isNextBlockPartOfCurrent) throw CannotMove
                        } catch (ex) {
                            if (current !== 'brown' && current !== '-' && belowBlock !== 'brown' && belowBlock !== '-') throw CannotMove
                        }
                    })
                })
            } catch (ex) {
                return false
            }
            return true
        }

        const onMoveLeft = () => {
            if (canMoveLeft()) {
                const { x, y } = blockOrigin
                removeCurrent(blockOrigin)
                currentBlock.block.forEach((column, indexY) => {
                    column.forEach((line, indexX) => {
                        if (line === '-' && y + indexY === 5) {
                            grid[y + indexY][x + indexX - 1] = 'brown'
                        } else {
                            if (line !== '-') grid[y + indexY][x + indexX - 1] = line
                        }
                    })
                })
                setGrid(grid)
                setBlockOrigin({ x: x - 1, y: y })
            }
        }

        const canMoveRight = () => {
            const { x, y } = blockOrigin
            const CannotMove = {}
            try {
                currentBlock.block.forEach((column, indexY) => {
                    column.forEach((line, indexX) => {
                        if (x + indexX + 1 > grid[y + indexY].length - 1) throw CannotMove
                        const current = grid[y + indexY][x + indexX]
                        const belowBlock = grid[y + indexY][x + indexX + 1]
                        let isNextBlockPartOfCurrent = false
                        try {
                            isNextBlockPartOfCurrent = currentBlock.block[indexY][indexX + 1] !== undefined
                            if (!isNextBlockPartOfCurrent) throw CannotMove
                        } catch (ex) {
                            if (current !== 'brown' && current !== '-' && belowBlock !== 'brown' && belowBlock !== '-') throw CannotMove
                        }
                    })
                })
            } catch (ex) {
                return false
            }
            return true
        }

        const onMoveRight = () => {
            if (canMoveRight()) {
                const { x, y } = blockOrigin
                removeCurrent(blockOrigin)
                currentBlock.block.forEach((column, indexY) => {
                    column.forEach((line, indexX) => {
                        if (line === '-' && y + indexY === 5) {
                            grid[y + indexY][x + indexX + 1] = 'brown'
                        } else {
                            if (line !== '-') grid[y + indexY][x + indexX + 1] = line
                        }
                    })
                })
                setGrid(grid)
                setBlockOrigin({ x: x + 1, y: y })
            }
        }

        const onRotateLeft = () => {
            let angle = currentBlock.angle.replace('deg', '') - 90
            if (angle < 0) angle = 270
            const newBlock = currentBlock.generator({ color: currentBlock.color, angle: angle + 'deg' })
            removeCurrent(blockOrigin)
            setCurrentBlock({
                block: newBlock,
                angle: angle + 'deg',
                color: currentBlock.color,
                generator: currentBlock.generator,
            })
        }
        const onRotateRight = () => {
            let angle = currentBlock.angle.replace('deg', '') + 90
            if (angle > 270) angle = 0
            const newBlock = currentBlock.generator({ color: currentBlock.color, angle: angle + 'deg' })
            removeCurrent(blockOrigin)
            setCurrentBlock({
                block: newBlock,
                angle: angle + 'deg',
                color: currentBlock.color,
                generator: currentBlock.generator,
            })
        }

        function onGameTicking() {
            if (!canMoveDown()) {
                if (blockOrigin.y < 5) {
                    const GameOver = new CustomEvent('GameOver', { detail: { playerNumber } })
                    document.dispatchEvent(GameOver)
                } else {
                    const BlockPlaced = new CustomEvent('BlockPlaced', { detail: { playerNumber } })
                    document.dispatchEvent(BlockPlaced)
                }
            } else {
                moveDown()
            }
        }

        const onDirectionEvent = ({ detail }) => {
            if (detail.player === playerNumber) {
                if (detail.orientations.includes('left')) onMoveLeft()
                if (detail.orientations.includes('right')) onMoveRight()
            }
        }
        const onActionEvent = ({ detail }) => {
            if (detail.player === playerNumber) {
                if (detail.type === 'A') onRotateLeft()
                if (detail.type === 'B') onRotateRight()
            }
        }

        const gameTick = setTimeout(onGameTicking, 200)
        if (!gameIsOver) {
            document.addEventListener('direction', onDirectionEvent)
            document.addEventListener('action', onActionEvent)
        }
        return () => {
            clearTimeout(gameTick)
            document.removeEventListener('direction', onDirectionEvent)
            document.removeEventListener('action', onActionEvent)
        }
    }, [grid, currentBlock, blockOrigin, isRunning, gameIsOver, playerNumber])

    return (
        <div className={'player ' + color}>
            <div className="gameInformations">
                <div className="playerName">Joueur {playerNumber}</div>
                <div className="nextPiece">
                    {nextBlock.block.map((line, index) => {
                        return (
                            <div key={index} className="line">
                                {line.map((texture, index) => (
                                    <Texture key={index} color={texture !== '-' ? texture : 'transparent'} />
                                ))}
                            </div>
                        )
                    })}
                </div>
                <div className="spacer"></div>
                <div className="score">Score : {score}</div>
            </div>
            <div className="gamezone">
                {grid.map((line, index) => {
                    return (
                        <div key={index} className="line">
                            {line.map((texture, index) => (
                                <Texture key={index} color={texture !== '-' ? texture : 'black'} />
                            ))}
                        </div>
                    )
                })}
            </div>
            {gameIsOver ? (
                <div className="gameover">
                    <div className="text">GAME OVER</div>
                </div>
            ) : null}
        </div>
    )
}

export default Player
