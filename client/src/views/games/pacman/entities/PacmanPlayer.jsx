/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import Ball from './Ball'
import Cherry from './Cherry'
import CherryPicked from './CherryPicked'
import Door from './Door'
import Empty from './Empty'
import Ghost from './Ghost'
import Marble from './Marble'
import PacmanLife from './PacmanLife'
import PacmanUser from './PacmanUser'
import Wall from './Wall'

const ghostColors = ['red', 'blue', 'yellow', 'orange']

function useForceUpdate() {
    const [, setValue] = useState(0)
    return () => setValue((value) => (value + 1) % 4)
}

function PacmanPlayer({ playerNumber }) {
    const defaultMap = [
        ['', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', ''],
        ['', 'W', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'W', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'W', ''],
        ['', 'W', 'B', 'W', 'W', 'M', 'W', 'W', 'W', 'M', 'W', 'M', 'W', 'W', 'W', 'M', 'W', 'W', 'B', 'W', ''],
        ['', 'W', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'W', ''],
        ['', 'W', 'M', 'W', 'W', 'M', 'W', 'M', 'W', 'W', 'W', 'W', 'W', 'M', 'W', 'M', 'W', 'W', 'M', 'W', ''],
        ['', 'W', 'M', 'M', 'M', 'M', 'W', 'M', 'M', 'M', 'W', 'M', 'M', 'M', 'W', 'M', 'M', 'M', 'M', 'W', ''],
        ['', 'W', 'W', 'W', 'W', 'M', 'W', 'W', 'W', ' ', 'W', ' ', 'W', 'W', 'W', 'M', 'W', 'W', 'W', 'W', ''],
        ['', '', '', '', 'W', 'M', 'W', ' ', ' ', ' ', 'G0', ' ', ' ', ' ', 'W', 'M', 'W', '', '', '', ''],
        ['W', 'W', 'W', 'W', 'W', 'M', 'W', ' ', 'W', 'W', 'D', 'W', 'W', ' ', 'W', 'M', 'W', 'W', 'W', 'W', 'W'],
        ['', '', '', '', '', 'M', ' ', ' ', 'W', 'G1', 'G2', 'G3', 'W', ' ', ' ', 'M', '', '', '', '', ''],
        ['W', 'W', 'W', 'W', 'W', 'M', 'W', ' ', 'W', 'W', 'W', 'W', 'W', ' ', 'W', 'M', 'W', 'W', 'W', 'W', 'W'],
        ['', '', '', '', 'W', 'M', 'W', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'W', 'M', 'W', '', '', '', ''],
        ['', 'W', 'W', 'W', 'W', 'M', 'W', ' ', 'W', 'W', 'W', 'W', 'W', ' ', 'W', 'M', 'W', 'W', 'W', 'W', ''],
        ['', 'W', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'W', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'W', ''],
        ['', 'W', 'M', 'W', 'W', 'M', 'W', 'W', 'W', 'M', 'W', 'M', 'W', 'W', 'W', 'M', 'W', 'W', 'M', 'W', ''],
        ['', 'W', 'B', 'M', 'W', 'M', 'M', 'M', 'M', 'M', 'P', 'M', 'M', 'M', 'M', 'M', 'W', 'M', 'B', 'W', ''],
        ['', 'W', 'W', 'M', 'W', 'M', 'W', 'M', 'W', 'W', 'W', 'W', 'W', 'M', 'W', 'M', 'W', 'M', 'W', 'W', ''],
        ['', 'W', 'M', 'M', 'M', 'M', 'W', 'M', 'M', 'M', 'W', 'M', 'M', 'M', 'W', 'M', 'M', 'M', 'M', 'W', ''],
        ['', 'W', 'M', 'W', 'W', 'W', 'W', 'W', 'W', 'M', 'W', 'M', 'W', 'W', 'W', 'W', 'W', 'W', 'M', 'W', ''],
        ['', 'W', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'M', 'W', ''],
        ['', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', ''],
    ]

    const defaultGhostsPositions = [
        { name: 'G0', x: 10, y: 7 },
        { name: 'G1', x: 9, y: 9 },
        { name: 'G2', x: 10, y: 9 },
        { name: 'G3', x: 11, y: 9 },
    ]

    const invisibleGhostWalls = [
        { x: 4, y: 9 },
        { x: 16, y: 9 },
    ]

    const defaultPacmanPosition = { x: 10, y: 15 }

    const [map, setMap] = useState([...defaultMap])
    const [translationOrientation, setTranslationOrientation] = useState(null)
    const [orientation, setOrientation] = useState('right')

    const [isDirectionUpPushed, setDirectionUpPushed] = useState(false)
    const [isDirectionDownPushed, setDirectionDownPushed] = useState(false)
    const [isDirectionLeftPushed, setDirectionLeftPushed] = useState(false)
    const [isDirectionRightPushed, setDirectionRightPushed] = useState(false)
    const [isDoorOpen, setIsDoorOpen] = useState(false)

    const [isDoorTicking, setIsDoorTicking] = useState(false)

    const [isCherryGenerated, setIsCherryGenerated] = useState(false)

    const [currentScore, setCurrentScore] = useState(0)
    const [remainingLifes, setRemainingLifes] = useState(3)
    const [cherriesPicked, setCherriesPicked] = useState(0)
    const [remainingItems, setRemainingItems] = useState(
        map.map((line) => line.filter((texture) => texture === 'M' || texture === 'B' || texture === 'C').length).reduce((sum, val) => sum + val)
    )
    const [pacmanPosition, setPacmanPosition] = useState({ ...defaultPacmanPosition })
    const [ghostsPositions, setGhostsPositions] = useState([...defaultGhostsPositions])
    const [lastGhostPositions, setLastGhostsPositions] = useState([...defaultGhostsPositions])
    const [lastGhostTexture, setLastGhostTexture] = useState(['', '', '', ''])

    const [canEatGhost, setCanEatGhost] = useState(false)
    const [eatenGhosts, setEatenGhosts] = useState(0)

    const [isGameOver, setGameOver] = useState(false)

    const forceUpdate = useForceUpdate()

    const onDeath = () => {
        if (!canEatGhost) {
            if (remainingLifes === 0) {
                setGameOver(true)
            } else {
                setRemainingLifes(remainingLifes - 1)
                setPacmanPosition(null)
                setTimeout(() => {
                    setPacmanPosition(defaultPacmanPosition)
                    map[defaultPacmanPosition.y][defaultPacmanPosition.x] = 'P'
                    forceUpdate()
                }, 300)
            }
        } else {
            const points = 200 * Math.pow(2, eatenGhosts + 1)
            setEatenGhosts(eatenGhosts + 1)
            setCurrentScore(currentScore + points)
        }
    }

    const generateMap = (currentMap) => {
        return currentMap.map((line, indexLine) => {
            return (
                <div key={indexLine} className="line">
                    {line.map((texture, indexTexture) => {
                        switch (texture) {
                            case 'W':
                                return <Wall key={indexTexture} />
                            case 'G0':
                            case 'G1':
                            case 'G2':
                            case 'G3':
                                const ghostNumber = texture.replace('G', '')
                                return <Ghost key={indexTexture} color={ghostColors[ghostNumber % 4]} isVulnerable={canEatGhost} />
                            case 'M':
                                return <Marble key={indexTexture} />
                            case 'B':
                                return <Ball key={indexTexture} />
                            case 'C':
                                return <Cherry key={indexTexture} />
                            case 'D':
                                return <Door key={indexTexture} isOpen={isDoorOpen} />
                            case 'P':
                                return <PacmanUser key={indexTexture} translation={translationOrientation ?? null} orientation={orientation} canEatGhost={canEatGhost} />
                            default:
                                return <Empty key={indexTexture} />
                        }
                    })}
                </div>
            )
        })
    }

    const amountOfLifes = () => {
        const lifes = []
        for (let i = 1; i <= remainingLifes; i++) {
            lifes.push(<PacmanLife key={lifes.length} />)
        }
        return lifes
    }

    const amountOfCherries = () => {
        const cherries = []
        for (let i = 1; i <= cherriesPicked; i++) {
            cherries.push(<CherryPicked key={cherries.length} />)
        }
        return cherries
    }

    const resetMap = () => {
        setMap([...defaultMap])
        setPacmanPosition({ ...defaultPacmanPosition })
        setGhostsPositions({ ...ghostsPositions })
        setLastGhostsPositions({ ...lastGhostPositions })
    }

    useEffect(() => {
        const moveUp = () => {
            let { x, y } = pacmanPosition
            if (map[y - 1][x] !== 'W' && map[y - 1][x] !== 'D') {
                setTranslationOrientation('up')
                setOrientation('up')
                setPacmanPosition({ x, y: y - 1 })
                setTimeout(() => {
                    if (map[y - 1][x] === 'M' || map[y - 1][x] === 'B' || map[y - 1][x] === 'C') {
                        if (map[y - 1][x] === 'M') setCurrentScore(currentScore + 10)
                        if (map[y - 1][x] === 'B') {
                            setCanEatGhost(true)
                            setTimeout(() => {
                                setCanEatGhost(false)
                                setEatenGhosts(0)
                            }, 10000)
                            setCurrentScore(currentScore + 50)
                        }
                        if (map[y - 1][x] === 'C') {
                            setCurrentScore(currentScore + 100)
                            setCherriesPicked(cherriesPicked + 1)
                            setIsCherryGenerated(false)
                        }
                        if (map[y - 1][x].includes('G')) {
                            onDeath()
                        }
                        const remainItems = remainingItems - 1
                        setRemainingItems(remainItems)
                        if (remainItems === 0) resetMap()
                    }
                    map[y][x] = ''
                    map[y - 1][x] = 'P'
                    setTranslationOrientation(null)
                }, 100)
            }
        }
        const moveDown = () => {
            let { x, y } = pacmanPosition
            if (map[y + 1][x] !== 'W' && map[y + 1][x] !== 'D') {
                setTranslationOrientation('down')
                setOrientation('down')
                setPacmanPosition({ x, y: y + 1 })
                setTimeout(() => {
                    if (map[y + 1][x] === 'M' || map[y + 1][x] === 'B' || map[y + 1][x] === 'C') {
                        if (map[y + 1][x] === 'M') setCurrentScore(currentScore + 10)
                        if (map[y + 1][x] === 'B') {
                            setCanEatGhost(true)
                            setTimeout(() => {
                                setCanEatGhost(false)
                                setEatenGhosts(0)
                            }, 10000)
                            setCurrentScore(currentScore + 50)
                        }
                        if (map[y + 1][x] === 'C') {
                            setCurrentScore(currentScore + 100)
                            setCherriesPicked(cherriesPicked + 1)
                            setIsCherryGenerated(false)
                        }
                        if (map[y + 1][x].includes('G')) {
                            onDeath()
                        }
                        const remainItems = remainingItems - 1
                        setRemainingItems(remainItems)
                        if (remainItems === 0) resetMap()
                    }
                    map[y][x] = ''
                    map[y + 1][x] = 'P'
                    setTranslationOrientation(null)
                }, 100)
            }
        }
        const moveLeft = () => {
            let { x, y } = pacmanPosition
            if (map[y][x - 1] !== 'W' && map[y][x - 1] !== 'D') {
                if (x - 1 < 0) x = map[y].length
                setTranslationOrientation('left')
                setOrientation('left')
                setPacmanPosition({ x: x - 1, y })
                setTimeout(() => {
                    if (map[y][x - 1] === 'M' || map[y][x - 1] === 'B' || map[y][x - 1] === 'C') {
                        if (map[y][x - 1] === 'M') setCurrentScore(currentScore + 10)
                        if (map[y][x - 1] === 'B') {
                            setCanEatGhost(true)
                            setTimeout(() => {
                                setCanEatGhost(false)
                                setEatenGhosts(0)
                            }, 10000)
                            setCurrentScore(currentScore + 50)
                        }
                        if (map[y][x - 1] === 'C') {
                            setCurrentScore(currentScore + 100)
                            setCherriesPicked(cherriesPicked + 1)
                            setIsCherryGenerated(false)
                        }
                        if (map[y][x - 1].includes('G')) {
                            onDeath()
                        }
                        const remainItems = remainingItems - 1
                        setRemainingItems(remainItems)
                        if (remainItems === 0) resetMap()
                    }
                    if (x === map[y].length) map[y][0] = ''
                    else map[y][x] = ''
                    map[y][x - 1] = 'P'
                    setTranslationOrientation(null)
                }, 100)
            }
        }
        const moveRight = () => {
            let { x, y } = pacmanPosition
            if (map[y][x + 1] !== 'W' && map[y][x + 1] !== 'D') {
                if (x + 1 > map[y].length - 1) x = -1
                setTranslationOrientation('right')
                setOrientation('right')
                setPacmanPosition({ x: x + 1, y })
                setTimeout(() => {
                    if (map[y][x + 1] === 'M' || map[y][x + 1] === 'B' || map[y][x + 1] === 'C') {
                        if (map[y][x + 1] === 'M') setCurrentScore(currentScore + 10)
                        if (map[y][x + 1] === 'B') {
                            setCanEatGhost(true)
                            setTimeout(() => {
                                setCanEatGhost(false)
                                setEatenGhosts(0)
                            }, 10000)
                            setCurrentScore(currentScore + 50)
                        }
                        if (map[y][x + 1] === 'C') {
                            setCurrentScore(currentScore + 100)
                            setCherriesPicked(cherriesPicked + 1)
                            setIsCherryGenerated(false)
                        }
                        if (map[y][x + 1].includes('G')) {
                            onDeath()
                        }
                        const remainItems = remainingItems - 1
                        setRemainingItems(remainItems)
                        if (remainItems === 0) resetMap()
                    }
                    if (x === -1) map[y][map[y].length - 1] = ''
                    else map[y][x] = ''
                    map[y][x + 1] = 'P'
                    setTranslationOrientation(null)
                }, 100)
            }
        }

        const onDirectionEvent = ({ detail }) => {
            const { player, orientations, type } = detail
            if (player === playerNumber) {
                if (orientations.includes('up')) setDirectionUpPushed(type === 'push')
                if (orientations.includes('down')) setDirectionDownPushed(type === 'push')
                if (orientations.includes('left')) setDirectionLeftPushed(type === 'push')
                if (orientations.includes('right')) setDirectionRightPushed(type === 'push')
            }
        }

        const onGameTick = () => {
            if (isDirectionUpPushed) moveUp(pacmanPosition)
            if (isDirectionDownPushed) moveDown(pacmanPosition)
            if (isDirectionLeftPushed) moveLeft(pacmanPosition)
            if (isDirectionRightPushed) moveRight(pacmanPosition)
            if (!isDirectionUpPushed && !isDirectionDownPushed && !isDirectionLeftPushed && !isDirectionRightPushed) setTranslationOrientation(null)
            ghostsPositions.forEach((ghostPosition) => {
                if (pacmanPosition !== null)
                    if (ghostPosition.x === pacmanPosition.x && ghostPosition.y === pacmanPosition.y) {
                        onDeath()
                        document.removeEventListener('direction', onDirectionEvent)
                    }
            })
            setMap(map)
        }

        if (!isGameOver) document.addEventListener('direction', onDirectionEvent)

        const gameTick = setInterval(() => onGameTick(), 110)

        return () => {
            clearInterval(gameTick)
            document.removeEventListener('direction', onDirectionEvent)
        }
    })

    useEffect(() => {
        const isSameOfLastPosition = (currentPosition, lastPosition) => {
            return currentPosition.name === lastPosition.name && currentPosition.x === lastPosition.x && currentPosition.y === lastPosition.y
        }

        const isInvisibleWall = ({ x, y }) => {
            try {
                const IsInvisibleWall = {}
                invisibleGhostWalls.forEach((invisibleWall) => {
                    if (invisibleWall.x === x && invisibleWall.y === y) throw IsInvisibleWall
                })
                return false
            } catch (ex) {
                return true
            }
        }

        const ghostMovement = () => {
            ghostsPositions.forEach(({ name, x, y }, index) => {
                const possibleMovements = []
                if (!map[y - 1][x].includes('G') && map[y - 1][x] !== 'W' && (map[y - 1][x] !== 'D' || isDoorOpen) && !isInvisibleWall({ x, y: y - 1 }))
                    possibleMovements.push({ x, y: y - 1 })
                if (!map[y + 1][x].includes('G') && map[y + 1][x] !== 'W' && (map[y + 1][x] !== 'D' || isDoorOpen) && !isInvisibleWall({ x, y: y + 1 }))
                    possibleMovements.push({ x, y: y + 1 })
                if (!map[y][x - 1].includes('G') && map[y][x - 1] !== 'W' && (map[y][x - 1] !== 'D' || isDoorOpen) && !isInvisibleWall({ x: x - 1, y }))
                    possibleMovements.push({ x: x - 1, y })
                if (!map[y][x + 1].includes('G') && map[y][x + 1] !== 'W' && (map[y][x + 1] !== 'D' || isDoorOpen) && !isInvisibleWall({ x: x + 1, y }))
                    possibleMovements.push({ x: x + 1, y })
                let movement = null
                if (map[y - 1][x] !== 'D' || isDoorOpen) {
                    if (map[y - 1][x] !== 'D') {
                        if (possibleMovements.length > 1) {
                            possibleMovements.forEach((movement, movementIndex) => {
                                if (isSameOfLastPosition({ name, ...movement }, lastGhostPositions[index])) possibleMovements.splice(movementIndex, 1)
                            })
                            const randomInt = Math.floor(Math.random() * possibleMovements.length)
                            movement = possibleMovements[randomInt]
                        }
                        if (possibleMovements.length === 1) movement = possibleMovements[0]
                    } else {
                        movement = { x, y: y - 1 }
                    }
                } else {
                    movement = null
                }
                if (movement !== null) {
                    lastGhostPositions[index] = ghostsPositions[index]
                    ghostsPositions[index] = { name, x: movement.x, y: movement.y }
                    map[y][x] = lastGhostTexture[index]
                    lastGhostTexture[index] = map[movement.y][movement.x] === 'P' ? ' ' : map[movement.y][movement.x]
                    map[movement.y][movement.x] = name
                }
            })
            setGhostsPositions(ghostsPositions)
            setLastGhostsPositions(lastGhostPositions)
            setLastGhostTexture(lastGhostTexture)
            forceUpdate()
        }

        const gameTick = setInterval(() => {
            ghostMovement()
        }, 220)
        return () => {
            clearInterval(gameTick)
        }
    }, [lastGhostTexture, lastGhostPositions, ghostsPositions, isDoorOpen])

    useEffect(() => {
        if (!isDoorOpen && !isDoorTicking) {
            setTimeout(() => {
                setIsDoorOpen(true)
                setTimeout(() => {
                    setIsDoorOpen(false)
                    setIsDoorTicking(false)
                }, 250)
            }, 5000)
            setIsDoorTicking(true)
        }
    }, [isDoorOpen, isDoorTicking])

    useEffect(() => {
        const generateRandom = (maxNumber) => {
            return Math.floor(Math.random() * maxNumber)
        }

        const generateCherry = () => {
            let x
            let y
            do {
                x = generateRandom(map[0].length)
                y = generateRandom(map.length)
            } while (map[y][x] !== ' ')
            map[y][x] = 'C'
            setRemainingItems(remainingItems + 1)
        }
        const cherryGeneration = setInterval(() => {
            if (!isCherryGenerated) generateCherry()
            setIsCherryGenerated(true)
        }, 60000)
        return () => {
            clearInterval(cherryGeneration)
        }
    }, [isCherryGenerated])

    return (
        <div className="player">
            <div className="player-informations">
                <div className="score">Joueur {playerNumber}</div>
                <div className="score">Score : {currentScore}</div>
            </div>
            <div className="map">{generateMap(map)}</div>
            <div className="container">
                <div className="informations">
                    <div className="lifes">
                        <div className="title">Vies restantes : </div>
                        {amountOfLifes()}
                    </div>
                    <div className="cherries">{amountOfCherries()}</div>
                </div>
                {isGameOver ? <div className="gameover">GAME OVER</div> : null}
            </div>
        </div>
    )
}

export default PacmanPlayer
