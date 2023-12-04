import { input } from './input'

//// PART 1
/*
given a string that looks something lke this: 
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

any numbers adjacent to a symbol(a symbol being a non-number, non period character)- including digaonally- is a PART NUMBER
function should return the SUM of all PART NUMBERS

need to track the row, column position range of each number, and the row,column position of each symbol
nums = [
  {467: [0, [0, 1, 2]]}
]
symbols = [
  [1,3],
  [6, 4]
]

symbolsByRow = {
  1: [4]
  8: [3, 5]
}

numsByRow = {
  0: {
    num: 467,
    cols: [0, 1, 2]
  }
}

FIRST:
  define a symbol as anything that is NOT a number or a period
  Get position of all numbers and all symbols, storing each in the format noted above:
  for each line:
    when we find a number, start storing the number, as well as its first position in the line.
    the row will be the current line number. [THIS, [xxx, xxx, xxx]]
    init a columns array representing the 'x' positions occupied by the current number
    the first digit in its columns will be the index of the first letter within the line [xxx, [THIS, xxx, xxx]]
    each extra digit we come across, we push to the columns array. 
    when we reach a non-number, add columns array to number location array
  

SECOND:
  to determine if a num is a PART NUMBER:
  is there a SYMBOL adjacent?
  is adjacent if:
    in same row, and 1 column higher than last num is column range OR 1 column lower than column range, OR
    in above row: 1 row lower, and anywhere between 1 column lower than first num in column range and 1 column higher than last num in column range, OR
    in below row: 1 row higher, and anywhere between 1 column lower than first num in column range and 1 column higher than last num in column range
  if symbol is adjacent, then add to accumulator
  return total

helper function isSymbolAdjacent(num):
nums = [
  {467: [0, [0, 1, 2]]}
]

symbolsByRow = {
  1: [4]
  8: [3, 5]
}
nums = [
  {
    num: 467
    pos: [0, [0, 1, 2]]
  }
]
*/

//// Note: Scrapped the above approach. New idea and ultimately successful solution to part 1:

/*
move through each line one column at a time.
when we find a number, start bulding a number.
as we bulid it, check all positions around to determine if there is a symbol adjacent. we want to do this with each digit we add to the number
*/

export const isSymbol = (char: string): boolean => {
  if (char === undefined) return false
  const notSymbols = '1234567890.'
  return !notSymbols.includes(char)
}

export const isNumber = (char: string): boolean => {
  return Number.isInteger(+char)
}

export const totalPartNumbers = (input: string) => {
  const isSymbolAdjacent = (row: number, col: number): boolean => {
    const prevRow = lines[row - 1]
    const currRow = lines[row]
    const nextRow = lines[row + 1]

    if (isSymbol(currRow[col - 1]) || isSymbol(currRow[col + 1])) return true
    if (prevRow) {
      if (
        isSymbol(prevRow[col - 1]) ||
        isSymbol(prevRow[col]) ||
        isSymbol(prevRow[col + 1])
      )
        return true
    }
    if (nextRow) {
      if (
        isSymbol(nextRow[col - 1]) ||
        isSymbol(nextRow[col]) ||
        isSymbol(nextRow[col + 1])
      )
        return true
    }
    return false
  }

  const lines = input.split(`\n`)
  // for (let line of lines) console.log(line)

  let total: number = 0

  let num: string = ''
  let buildingNum = false
  let isPartNumber: boolean = false

  let parts: number[] = []

  lines.forEach((line: string, row: number) => {
    for (let col = 0; col < line.length; col++) {
      //// Grab current character.
      const char = line[col]

      if (isNumber(char)) {
        //// Char is a number. Adding it to built number.
        buildingNum = true
        num += char

        //// If we've already determined that the current number being built is a part, keep it that way.
        isPartNumber = isPartNumber || isSymbolAdjacent(row, col)

        //// This clause fires if the current character is not a number.
        //// In such a case, if we had built a number and found any digit therein adjacent to a symbol, then we want to add that number to the total.
      } else {
        buildingNum = false

        if (num.length > 0 && isPartNumber) {
          total += +num
          parts.push(+num)
          isPartNumber = false
        }
        num = ''
      }
      if (col === line.length - 1) {
        buildingNum = false

        if (num.length > 0 && isPartNumber) {
          total += +num
          parts.push(+num)
          isPartNumber = false
        }
        num = ''
      }
    }
  })

  return total
}

//// VICTORY!!!
console.log(totalPartNumbers(input), 546312)

//// The hundred billion test cases I worked through trying to debug this damn thing.
//// Scroll past all this junk to get to my Part 2 solution.
// console.log(
//   totalPartNumbers(
//     `467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..`
//   ),
//   4361
// )
// console.log(
//   totalPartNumbers(
//     `467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// .....*....
// 664..598..`
//   ),
//   3697
// )

/*
..............*.........243.................287................*............$....245............830.........793......#..........306..*......
238.685.................*................#.........%........807.........28.947.................*.....705.....*....573...500*781...#..496....
..................989..923.......713...539......917.................115..*.....-...........662.........-......413...........................
*/

// console.log(
//   totalPartNumbers(`
// ..............*.........243.................287................*............$....245............830.........793......#..........306..*......
// 238.685.................*................#.........%........807.........28.947.................*.....705.....*....573...500*781...#..496....
// ..................989..923.......713...539......917.................115..*.....-...........662.........-......413...........................`)
// )

/*
...........=......*..........886.*.........................442......*...........398........*.............%.............636...........%......
............976.413...498..../...266........796....................87.....................969.881..&.....815...........*.....279....415.....
......728*..............*..............129..........670...890.....................760...=.......@.832........227.....632.212*...............
*/

// console.log(
//   totalPartNumbers(
//     `...........=......*..........886.*.........................442......*...........398........*.............%.............636...........%......
// ............976.413...498..../...266........796....................87.....................969.881..&.....815...........*.....279....415.....
// ......728*..............*..............129..........670...890.....................760...=.......@.832........227.....632.212*...............`
//   )
// )

// console.log(
//   totalPartNumbers(`.........426.............985.........40..........207............................841..463................................633........17.384...
// 531&......+..........125....-..312..........#........895......998..945.....@......$.....-...33...................353.....*........*.........
// ........................#......*...........21..727..*..../..-./.............545......80...................602......@..272.......743.........
// ...........558.577..........486...186*925.....*....483.883.1....286...................................625..................#474.....491.....
// ..............*.........243.................287................*............$....245............830.........793......#..........306..*......
// 238.685.................*................#.........%........807.........28.947.................*.....705.....*....573...500*781...#..496....
// ..................989..923.......713...539......917.................115..*.....-...........662.........-......413...........................
// ...........=......*..........886.*.........................442......*...........398........*.............%.............636...........%......
// ............976.413...498..../...266........796....................87.....................969.881..&.....815...........*.....279....415.....
// ......728*..............*..............129..........670...890.....................760...=.......@.832........227.....632.212*...............`)
// )

// const testCases: [string, number][] = [
//   [
//     `........
// .24..4..
// ......*.`,
//     4,
//   ],
//   [
//     `........
// .24$-4..
// ......*.`,
//     28,
//   ],
//   [
//     `11....11
// ..$..$..
// 11....11`,
//     44,
//   ],
//   [
//     `$......$
// .1....1.
// .1....1.
// $......$`,
//     4,
//   ],
//   [
//     `$......$
// .11..11.
// .11..11.
// $......$`,
//     44,
//   ],
//   [
//     `$11
// ...
// 11$
// ...`,
//     22,
//   ],
//   [
//     `$..
// .11
// .11
// $..
// ..$
// 11.
// 11.
// ..$`,
//     44,
//   ],
//   [`11.$.`, 0],
// ]

// for (let test of testCases) {
//   console.log(totalPartNumbers(test[0]), test[1])
// }

///// ----------- PART 2 ------------------
/*

as we search for adjacent symbols while bulding a num:
set an array to hold all gears we encounter
if the symbol is a * for a particular numBuilding session, get the row,col for the gear.


when done building the part, look through the gears array for a gear with a matching loc: [row,col] property
  if no matching gear, push new gearInfo object into gears array. init adj with the part
  if matching gear found, push current part number into adj. 

at the end, filter gears to only include those with adj.length === 2
reduce the result. bing bang boom

*/

export const sumGearRatios = (input: string) => {
  ////! ---------------- TYPES & CLASSES ----------------
  //// Representing the row and column position of a gear.
  type GearLoc = [number, number] // row, col

  //// Everything we need to know about a gear to solve the puzzle: its location, and an array of all adjacent parts.
  class GearInfo {
    loc: [number, number] // row, col
    adj: number[] // list of adjacent parts
    constructor(loc: [number, number], part: number) {
      this.loc = loc
      this.adj = [part]
    }
  }

  ////! ---------------- HELPER FUNCTIONS ----------------

  //// This function locates all gears adjacent to the passed-in position, and updates the tempGear array with their locations.
  const findAdjacentGears = (row: number, col: number): void => {
    //// This class creates objects representing a character which is found to be adjacent to the current character we are looking at in the main loop. The character itself and its position are stored here.
    class SurroundingCharInfo {
      char: string
      pos: [number, number]
      constructor(row: number, col: number) {
        this.char = lines[row][col]
        this.pos = [row, col]
      }
    }
    //// Grab references to previous and next rows.
    const prevRow = lines[row - 1]
    const nextRow = lines[row + 1]

    //// Initialize the object which will hold ALL characters surrounding the current character.
    const surroundingChars: Record<string, null | SurroundingCharInfo> = {
      aboveLeft: null,
      above: null,
      aboveRight: null,
      left: null,
      right: null,
      belowLeft: null,
      below: null,
      belowRight: null,
    }

    //// This section fills out the surroundingChars record.
    if (prevRow) {
      surroundingChars['aboveLeft'] = new SurroundingCharInfo(row - 1, col - 1)
      surroundingChars['above'] = new SurroundingCharInfo(row - 1, col)
      surroundingChars['aboveRight'] = new SurroundingCharInfo(row - 1, col + 1)
    }

    surroundingChars['left'] = new SurroundingCharInfo(row, col - 1)
    surroundingChars['right'] = new SurroundingCharInfo(row, col + 1)

    if (nextRow) {
      surroundingChars['belowLeft'] = new SurroundingCharInfo(row + 1, col - 1)
      surroundingChars['below'] = new SurroundingCharInfo(row + 1, col)
      surroundingChars['belowRight'] = new SurroundingCharInfo(row + 1, col + 1)
    }

    //// Now we need to find all surrounding characters that are '*'s- henceforth referred to as GEARS).
    for (let surroundingChar in surroundingChars) {
      //// Extract character and position array from surroundingChar object.
      const char = surroundingChars[surroundingChar]?.char
      const pos = surroundingChars[surroundingChar]?.pos

      //// If the character is a GEAR...
      if (char && char === '*') {
        //// Check if we have any gears stored in the tempGears array yet. If not, add this GEAR's position to it.
        if (tempGears.length === 0) {
          tempGears.push([pos![0], pos![1]])
          //// If we have already stored at least one GEAR in tempGears, then we need to iterate through it to ensure we don't place a duplicate position.
        } else {
          let newTempGears: [number, number][] = [...tempGears]
          let newGear = true
          tempGears.forEach((tempGear) => {
            if (pos && tempGear[0] === pos[0] && tempGear[1] === pos[1]) {
              //// This gear already exists in tempGears! Update newGear flag to prevent us from adding a duplicate at the end of the loop.
              newGear = false
            }
          })
          if (newGear) {
            //// If we got through the above loop and never found a matching gear, add the current gear's location to temp gears.
            newTempGears.push([pos![0], pos![1]])
          }
          //// Update the main tempGears reference to reflect our changes.
          tempGears = newTempGears
        }
      }
    }
  }

  //// We run this function whenever we finish "building" a complete part (that is, a sequence of consecutive numbers).
  const resetPartBulding = () => {
    if (num.length > 0 && hasAdjacentGears) {
      hasAdjacentGears = false
      if (gears.length === 0) {
        for (let tempGear of tempGears) {
          gears.push(new GearInfo([tempGear[0], tempGear[1]], +num))
        }
      } else {
        for (let tempGear of tempGears) {
          let newGear = true
          for (let gear of gears) {
            if (gear.loc[0] === tempGear[0] && gear.loc[1] === tempGear[1]) {
              gear.adj.push(+num)
              newGear = false
              break
            }
          }
          if (newGear) {
            gears.push(new GearInfo([tempGear[0], tempGear[1]], +num))
          }
        }
      }

      tempGears = []
    }
    num = ''
  }

  //// Major vars.
  const lines = input.split(`\n`)
  const gears: GearInfo[] = []

  //// Temp vars and flags
  let num: string = ''
  let hasAdjacentGears: boolean = false

  //// tempGears will hold the locations of all Gears found adjacent to the current Part. Once we reach the end of any one part, any gears within tempGears are added to the primary gears array.
  let tempGears: GearLoc[] = []

  lines.forEach((line: string, row: number) => {
    for (let col = 0; col < line.length; col++) {
      const char = line[col]

      if (isNumber(char)) {
        num += char

        findAdjacentGears(row, col)
        hasAdjacentGears = tempGears.length > 0

        //// This clause fires if the current character is not a number.
        //// In such a case, if we had built a number and found any digit therein adjacent to a symbol, then we want to add that number to the total.
      } else {
        resetPartBulding()
      }
      if (col === line.length - 1) {
        resetPartBulding()
      }
    }
  })

  return gears
    .filter((gear) => gear.adj.length === 2)
    .reduce((acc, curr) => {
      const gearRatio = curr.adj.reduce((acc, curr) => acc * curr)
      return acc + gearRatio
    }, 0)
}

console.log(
  sumGearRatios(`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`),
  467835
)

//// VICTORY ~~~~~
console.log(sumGearRatios(input), 87449461)
