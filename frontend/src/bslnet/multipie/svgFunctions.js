const M = vector => `M ${vector.x} ${vector.y}`

const L = vector => `L ${vector.x} ${vector.y}`

const A = radius => endVector => (arcFlag = 0) =>
  `A ${radius} ${radius} 0 ${arcFlag} 1 ${endVector.x} ${endVector.y}`

const outerA = radius => endVector => (arcFlag = 0) =>
`A ${radius} ${radius} 0 ${arcFlag} 0 ${endVector.x} ${endVector.y}`

const calcArcFlag = theta1 => theta2 =>
  Math.abs(theta1 - theta2) > Math.PI
    ? 1
    : 0

// const calcSweepFlag = theta1 => theta2 =>
//   Math.abs(theta1 - theta2) > Math.PI
//     ? 1
//     : 1



export { M, L, A, outerA, calcArcFlag }