//// https://adventofcode.com/2023/day/8

import { input } from './input'

const sampleInput = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

//// PLANNING
/*
now we need to simultaneously traverse multiple paths at once.
start at every single node that ends in A
and don't stop until every single path we're following ends in a Z

find all starting positions that end in A
make a map of all paths, with a key equal to the starting position.
the value will be the node we land on after following a step along that particular path
every step, update that value across all keys.
after every update, check if all values end in Z. otherwise, carry on

to start:
allPaths = {
 11A: 11A
 22A: 22A
}


 ^TOO SLOW OH NO
what if we... counted the number of steps to reach a Z from each entry point.

find the least common multiple among the stepsToZ
*/

class Node {
  left: string
  right: string
  stepsToZ: number | null
  constructor(left: string, right: string) {
    this.left = left
    this.right = right
    this.stepsToZ = null
  }
}

export const parseInput = (input: string) => {
  const directionsAndMapString = input.split(`\n\n`)
  const directions = directionsAndMapString[0]
  const mapString = directionsAndMapString[1]

  const mapArray = mapString.split(`\n`)

  const map: Record<string, Node> = {}

  const paths: Record<string, string> = {}

  let pathsSize = 0

  mapArray.forEach((nodeString) => {
    const nodeKeyAndEdges = nodeString.split(' = ')
    const nodeKey = nodeKeyAndEdges[0]
    const edges = nodeKeyAndEdges[1]
      .slice(1, nodeKeyAndEdges[1].length - 1)
      .split(', ')

    map[nodeKey] = new Node(edges[0], edges[1])

    if (nodeKey.endsWith('A')) {
      paths[nodeKey] = nodeKey
      pathsSize += 1
    }
  })

  // console.log(pathsSize)

  return { directions, map, paths }
}

// console.log(parseInput(sampleInput))
// console.log(parseInput(input))

export const calculateStepsToZ = (
  directions: string,
  map: Record<string, Node>,
  node: string
) => {
  let stepsToZ = 0
  let directionsIndex = 0
  let currentNode = node
  while (!currentNode.endsWith('Z')) {
    stepsToZ++
    const direction = directions[directionsIndex]

    switch (direction) {
      case 'L':
        currentNode = map[currentNode].left
        break
      case 'R':
        currentNode = map[currentNode].right
        break
      default:
        console.warn(`We shouldn't be here.`)
        break
    }
    if (directionsIndex === directions.length - 1) {
      directionsIndex = 0
    } else directionsIndex++
  }

  return stepsToZ
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

function lcmOfArray(numbers: number[]): number {
  if (numbers.length < 2) {
    throw new Error('At least two numbers are required to find the LCM.')
  }

  let result = numbers[0]
  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i])
  }

  return result
}

export const traverseMap = (input: string) => {
  const start = Date.now()
  const { directions, map, paths } = parseInput(input)

  const stepsToZArr: number[] = []

  for (let path in paths) {
    stepsToZArr.push(calculateStepsToZ(directions, map, path))
  }

  console.log(stepsToZArr)

  const totalMs = Date.now() - start
  console.log(
    `total runtime:\n${totalMs} milliseconds\n${totalMs / 1000} seconds\n${
      totalMs / 1000 / 60
    } minutes`
  )

  return lcmOfArray(stepsToZArr)
}

console.log(traverseMap(sampleInput))

//// VICTORY
console.log(traverseMap(input))
