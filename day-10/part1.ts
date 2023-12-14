//// https://adventofcode.com/2023/day/9

import { input } from './input'

const sampleInput = `.....
.S-7.
.|.|.
.L-J.
.....`
const sampleInput2 = `.....
.F-7.
.|.|.
.LSJ.
.....`
const sampleInput3 = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`

//// PLANNING
/*

.....
.F-7.
.|.|.
.L-J.
.....

with animal is:
.....
.S-7.
.|.|.
.L-J.
.....

make an array of input rows:
x ====>
[.,.,.,.,.]  y
[.,S,-,7,.] ||
[.,|,.,|,.] ||
[.,L,-,J,.] \/
[.,.,.,.,.]

now each sqaure has a y, x position of ROW, COLUMN



find animal position - ez

from animal position, check what adjacent pipes are enter-able
north(y - 1) could be: |, 7, F
east(x + 1) could be: -, 7, J
south(y + 1) could be: |, L, J
west(x - 1) could be: -, F, L

from there, start moving down each pipe simulataneously, increasing steps by 1 each time.

use a map for movement

key:    the direction used to enter the pipe
value:  the direction the entrant is spit out of

example pipe:
  'F' : {
    W: 'S',
    N: 'E'
  },
- If we enter this pipe from the east- meaning the last pipe we existed through the WEST- then this pipe spits out to the SOUTH
- If we enter it from the south- meaning we exited the last pipe from the NORTH, then this spits us EAST

the direction spit out of is passed to next pipe as direction entered.

we'll use this map to move

pipes = {
  '|' : {
    N: 'N'
    S: 'S'
  },
  '-' : {
    E: 'E'
    W: 'W'
  }
  'L' : {
    W: 'N'
    S: 'E'
  }
  ...etc
}

move through the pipes in both directions at once.
we'll know we're at th farthest position when both directions are looking at the same pipe


*/

type PipeMap = {
  [key: string]: {
    [key: string]: string
  }
}

const pipes: PipeMap = {
  '|': {
    N: 'N',
    S: 'S',
  },
  '-': {
    E: 'E',
    W: 'W',
  },
  L: {
    W: 'N',
    S: 'E',
  },
  J: {
    E: 'N',
    S: 'W',
  },
  '7': {
    E: 'S',
    N: 'W',
  },
  F: {
    W: 'S',
    N: 'E',
  },
}

export const parseInput = (input: string) => {
  return input.split(`\n`)
}

export const findAnimal = (maze: string[]) => {
  let animalPosition: [number, number] = [-1, -1]
  for (let y = 0; y < maze.length - 1; y++) {
    const row = maze[y]
    if (row.includes('S')) {
      animalPosition = [y, row.indexOf('S')]
      break
    }
  }
  if (animalPosition.includes(-1)) throw new Error('No animal found.')
  return animalPosition
}

// console.log(findAnimal(parseInput(sampleInput)))
// console.log(findAnimal(parseInput(sampleInput2)))

export const findValidAdjacentPipes = (maze: string[], animalPos: number[]) => {
  const mazeHeight = maze.length - 1
  const mazeWidth = maze[0].length - 1

  const [animalY, animalX] = animalPos
  const northPipe = animalY > 0 ? maze[animalY - 1][animalX] : null
  const southPipe = animalY < mazeHeight ? maze[animalY + 1][animalX] : null
  const westPipe = animalX > 0 ? maze[animalY][animalX - 1] : null
  const eastPipe = animalX < mazeWidth ? maze[animalY][animalX + 1] : null

  const validNorthPipes = '|7F'
  const validSouthPipes = '|JL'
  const validWestPipes = '-FL'
  const validEastPipes = '-J7'

  const validAdjacentPipePositions: [number, number][] = []
  const startingDirections: string[] = []
  const validAdjacentPipes: string[] = []

  if (northPipe && validNorthPipes.includes(northPipe)) {
    validAdjacentPipePositions.push([animalY - 1, animalX])
    validAdjacentPipes.push(northPipe)
    startingDirections.push('N')
  }

  if (southPipe && validSouthPipes.includes(southPipe)) {
    validAdjacentPipePositions.push([animalY + 1, animalX])
    validAdjacentPipes.push(southPipe)
    startingDirections.push('S')
  }

  if (westPipe && validWestPipes.includes(westPipe)) {
    validAdjacentPipePositions.push([animalY, animalX - 1])
    validAdjacentPipes.push(westPipe)
    startingDirections.push('W')
  }

  if (eastPipe && validEastPipes.includes(eastPipe)) {
    validAdjacentPipePositions.push([animalY, animalX + 1])
    validAdjacentPipes.push(eastPipe)
    startingDirections.push('E')
  }

  return { validAdjacentPipes, validAdjacentPipePositions, startingDirections }
}

export const traversePipeSegment = (
  prevPosition: [number, number],
  prevExitDirection: string,
  currentPipe: string
) => {
  const exitDirection = pipes[currentPipe][prevExitDirection]
  let newPosition: [number, number] = [-1, -1]
  switch (exitDirection) {
    case 'N':
      newPosition = [prevPosition[0] - 1, prevPosition[1]]
      break
    case 'S':
      newPosition = [prevPosition[0] + 1, prevPosition[1]]
      break
    case 'W':
      newPosition = [prevPosition[0], prevPosition[1] - 1]
      break
    case 'E':
      newPosition = [prevPosition[0], prevPosition[1] + 1]
      break
  }

  return { newPosition, exitDirection }
}

export const traversePipeMaze = (input: string) => {
  const maze = parseInput(input)
  const animalPos = findAnimal(maze)
  const { validAdjacentPipes, validAdjacentPipePositions, startingDirections } =
    findValidAdjacentPipes(maze, animalPos)

  // console.log(findValidAdjacentPipes(maze, animalPos))
  // let [currentPath1Pipe, currenPath2Pipe] = validAdjacentPipes
  let [path1Position, path2Position] = validAdjacentPipePositions

  let [path1PrevExitDirection, path2PrevExitDirection] = startingDirections

  //// Start steps at 1 to represent the 1st step in either direction into the first adjacent pipes.
  let steps = 1

  //// We'll break the loop once both paths arrive at the same position.
  while (
    !(
      path1Position[0] === path2Position[0] &&
      path1Position[1] === path2Position[1]
    )
  ) {
    steps++
    //// Path 1:
    const currentPath1Pipe = maze[path1Position[0]][path1Position[1]]
    let {
      newPosition: newPath1Position,
      exitDirection: newPath1ExitDirection,
    } = traversePipeSegment(
      path1Position,
      path1PrevExitDirection,
      currentPath1Pipe
    )
    path1Position = newPath1Position
    path1PrevExitDirection = newPath1ExitDirection

    //// Path 2:
    const currentPath2Pipe = maze[path2Position[0]][path2Position[1]]
    let {
      newPosition: newPath2Position,
      exitDirection: newPath2ExitDirection,
    } = traversePipeSegment(
      path2Position,
      path2PrevExitDirection,
      currentPath2Pipe
    )
    path2Position = newPath2Position
    path2PrevExitDirection = newPath2ExitDirection

    // console.log(`Step: ${steps}`)
    // console.log('Path 1 Pos:', path1Position)
    // console.log('Path 2 Pos:', path2Position)
  }
  return steps
}

// console.log(traversePipeMaze(sampleInput))
// console.log(traversePipeMaze(sampleInput2))

// console.log(traversePipeSegment([2, 2], 'E', '7'), 'S')
// console.log(traversePipeSegment([2, 2], 'N', '7'), 'W')
// console.log(traversePipeSegment([2, 2], 'W', 'F'), 'S')
// console.log(traversePipeSegment([2, 2], 'N', 'F'), 'E')
// console.log(traversePipeSegment([2, 2], 'N', '|'), 'N')
// console.log(traversePipeSegment([2, 2], 'S', '|'), 'S')
// console.log(traversePipeSegment([2, 2], 'E', 'J'), 'N')
// console.log(traversePipeSegment([2, 2], 'S', 'J'), 'W')

// console.log(traversePipeMaze(sampleInput), 4)
console.log(traversePipeMaze(sampleInput2), 4)
console.log(traversePipeMaze(sampleInput3), 8)

console.log(traversePipeMaze(input))
