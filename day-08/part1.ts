//// https://adventofcode.com/2023/day/8

import { input } from './input'

const sampleInput = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`

//// PLANNING
/*
extract direction string

Build an object like so:
map = {
  'AAA': { left: 'BBB', right: 'CCC' },
  'BBB': { left: 'DDD', right: 'EEE' },
  'CCC': { left: 'ZZZ', right: 'GGG' },
  ...etc
}

starting at AAA-order of nodes in input doesn't matter
follow directions, iterating through direction string and counring each step

*/

class Node {
  left: string
  right: string
  constructor(left: string, right: string) {
    this.left = left
    this.right = right
  }
}

export const parseInput = (input: string) => {
  const directionsAndMapString = input.split(`\n\n`)
  const directions = directionsAndMapString[0]
  const mapString = directionsAndMapString[1]

  const mapArray = mapString.split(`\n`)

  const map: Record<string, Node> = {}

  mapArray.forEach((nodeString) => {
    const nodeKeyAndEdges = nodeString.split(' = ')
    const nodeKey = nodeKeyAndEdges[0]
    const edges = nodeKeyAndEdges[1]
      .slice(1, nodeKeyAndEdges[1].length - 1)
      .split(', ')

    map[nodeKey] = new Node(edges[0], edges[1])
  })

  // console.log(map)

  return { directions, map }
}

// console.log(parseInput(sampleInput))

export const traverseMap = (input: string) => {
  const { directions, map } = parseInput(input)

  let totalSteps = 0

  let directionsIndex = 0

  let currentNode = 'AAA'

  while (currentNode !== 'ZZZ') {
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

    // currentNode = map[currentNode]

    totalSteps++
    if (directionsIndex === directions.length - 1) {
      directionsIndex = 0
    } else directionsIndex++
  }

  return totalSteps
}

//// VICTORY
console.log(traverseMap(input))
