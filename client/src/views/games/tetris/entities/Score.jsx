import { useState } from 'react'

function Score() {
    const [score, setScore] = useState(0)
    return <div className="score">{score}</div>
}

export default Score
