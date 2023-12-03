/////////////////////////////////////
////////// ANKI - JAVASCRIPT ////////
/////////////////////////////////////

console.log('--------ANKI-----------')

import { input } from './input'

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

type numberData = {
  num: number
  pos: [number, number[]]
}

type numRowCols = [number, number[]] // [row, [col1, col2, col3, etc]]

// export const isSymbol = (char: string): boolean => {
//   const notSymbols = '1234567890.'
//   return !notSymbols.includes(char)
// }

export const totalPartNumbers = (input: string) => {
  const nums: numberData[] = []
  const symbolsByRow: Record<string, number[]> = {}

  const lines = input.split('\n')

  lines.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      if (Number.isInteger(+line[col])) {
        let potentialPartNumber: string = line[col]
        let columns: number[] = [col]
        for (let j = col + 1; j < line.length; col++, j++) {
          if (Number.isInteger(+line[j])) {
            potentialPartNumber += line[j]
            columns.push(j)
          } else {
            nums.push({ num: +potentialPartNumber, pos: [row, columns] })
            break
          }
        }
      } else if (line[col] !== '.') {
        const rowStr = String(row)
        // console.log(row)
        if (symbolsByRow[rowStr] !== undefined) symbolsByRow[rowStr].push(col)
        else symbolsByRow[rowStr] = [col]
      }
    }
  })
  // console.log(nums)
  console.log(symbolsByRow)

  let result = 0
  let hundreds: any[] = []

  for (let num of nums) {
    if (num.num === 100) hundreds.push(num)
    const [row, cols] = num.pos
    let isPartNumber = false
    // console.log(num)

    let nearbySymbolPositions: number[] = []
    const symbolsOnPrevLine = symbolsByRow[row - 1]
    if (symbolsOnPrevLine)
      nearbySymbolPositions = nearbySymbolPositions.concat(symbolsOnPrevLine)
    const symbolsOnSameLine = symbolsByRow[row]
    if (symbolsOnSameLine)
      nearbySymbolPositions = nearbySymbolPositions.concat(symbolsOnSameLine)
    const symbolsOnNextLine = symbolsByRow[row + 1]
    if (symbolsOnNextLine)
      nearbySymbolPositions = nearbySymbolPositions.concat(symbolsOnNextLine)

    // console.log(nearbySymbolPositions)
    // console.log('-----')
    for (let col of cols) {
      if (
        nearbySymbolPositions.includes(col - 1) ||
        nearbySymbolPositions.includes(col) ||
        nearbySymbolPositions.includes(col + 1)
      ) {
        result += +num.num
        isPartNumber = true
        break
      }
    }
  }

  console.log(hundreds)
  return result
}

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

/*

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

*/

// console.log(
//   totalPartNumbers(
//     `467..114..
// ...*......
// .755..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// .755^.755.
// ...$.*....
// .664.598..`
//   ),
//   5836
// )

// console.log(totalPartNumbers(input))

/*
what if, instead, whenever we came to a number we just checked the prev, same, and next line right then and there




*/

export const totalPartNumbers2 = (input: string) => {
  const lines = input.split(`\n`)
  const notSymbols = '123456789.'

  let total: number = 0

  lines.forEach((line: string, row: number) => {
    console.log(line)
    const prevLineExists = row > 0
    const nextLineExists = row < lines.length - 1
    for (let col = 0; col < line.length; col++) {
      if (Number.isInteger(+line[col])) {
        let isPartNumber = false
        let num = line[col]
        for (let j = col + 1; j < line.length; j++, col++) {
          if (
            !notSymbols.includes(lines[row][col - 1]) ||
            !notSymbols.includes(lines[row][col + 1])
          )
            if (prevLineExists) {
              if (
                !notSymbols.includes(lines[row - 1][col - 1]) ||
                !notSymbols.includes(lines[row - 1][col]) ||
                !notSymbols.includes(lines[row - 1][col + 1])
              )
                isPartNumber = true
            }
          if (nextLineExists) {
            if (
              !notSymbols.includes(lines[row + 1][col - 1]) ||
              !notSymbols.includes(lines[row + 1][col]) ||
              !notSymbols.includes(lines[row + 1][col + 1])
            )
              isPartNumber = true
          }
          if (Number.isInteger(+line[j])) {
            num += line[j]
            if (isPartNumber) {
              console.log('num:', num)
              total += +num
            }
            break
          }
        }
      }
    }
  })

  return total
}

/*
move through each line one column at a time.
when we find a number, start bulding a number.
as we bulid it, check all positions around to determine if there is a symbol adjacent. we want to do this with each digit we add to the number

*/

// export const isSymbolAdjacent = (row:number, col:number):boolean => {
//   if(lines[row - 1])
// }

export const isSymbol = (char: string): boolean => {
  if (char === undefined) return false
  const notSymbols = '1234567890.'
  return !notSymbols.includes(char)
}

export const isNumber = (char: string): boolean => {
  return Number.isInteger(+char)
}

export const totalPartNumbers3 = (input: string) => {
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
  for (let line of lines) console.log(line)

  let total: number = 0

  let num: string = ''
  let buildingNum = false
  let isPartNumber: boolean = false

  let parts: number[] = []

  lines.forEach((line: string, row: number) => {
    for (let col = 0; col < line.length; col++) {
      const char = line[col]

      if (isNumber(char)) {
        // console.log(`${char} is a number. Adding it to built number.`)
        buildingNum = true
        num += char
        // console.log('Built number:', num)
        isPartNumber = isPartNumber || isSymbolAdjacent(row, col)
        // console.log(char, isPartNumber)
        //// This clause fires if the current character is not a number.
        //// In such a case, if we had built a number and found any digit therein adjacent to a symbol, then we want to add that number to the total.
      } else {
        // console.log(
        //   `${char} is NOT a number. Our built number is currently ${num}, and isPartNumber is ${isPartNumber}`
        // )
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
  for (let part of parts) {
    // console.log(part.toString().padStart(3, '0'))
    console.log(part)
  }
  return total
  // return parts.reduce((acc, curr) => acc + curr)
}

// console.log(
//   totalPartNumbers3(
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
//   totalPartNumbers3(
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
//   totalPartNumbers3(`
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
//   totalPartNumbers3(
//     `...........=......*..........886.*.........................442......*...........398........*.............%.............636...........%......
// ............976.413...498..../...266........796....................87.....................969.881..&.....815...........*.....279....415.....
// ......728*..............*..............129..........670...890.....................760...=.......@.832........227.....632.212*...............`
//   )
// )

// console.log(
//   totalPartNumbers3(`.........426.............985.........40..........207............................841..463................................633........17.384...
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
//   console.log(totalPartNumbers3(test[0]), test[1])
// }

// console.log(totalPartNumbers3(input))
// console.log(totalPartNumbers3(input2))

///// PART 2
/*

as we search for adjacent symbols:
if the symbol is a * for a particular numBuilding session,




*/

type gearInfo = {
  loc: [number, number] // row, col
  adj: number //number of adjacent parts
}

export const totalPartNumbersAndGearRatios = (input: string) => {
  const gears: gearInfo[] = []

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

  let total: number = 0

  let num: string = ''
  let buildingNum = false
  let isPartNumber: boolean = false

  let parts: number[] = []

  lines.forEach((line: string, row: number) => {
    for (let col = 0; col < line.length; col++) {
      const char = line[col]

      if (isNumber(char)) {
        // console.log(`${char} is a number. Adding it to built number.`)
        buildingNum = true
        num += char
        // console.log('Built number:', num)
        isPartNumber = isPartNumber || isSymbolAdjacent(row, col)
        // console.log(char, isPartNumber)
        //// This clause fires if the current character is not a number.
        //// In such a case, if we had built a number and found any digit therein adjacent to a symbol, then we want to add that number to the total.
      } else {
        // console.log(
        //   `${char} is NOT a number. Our built number is currently ${num}, and isPartNumber is ${isPartNumber}`
        // )
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
  //  for (let part of parts) {
  //    console.log(part)
  //  }
  return total
}

console.log('--------END ANKI-----------')

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////

//////////////////////////////////
//////////// LEETCODE ////////////
//////////////////////////////////

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////

////////////////////////////////////////////////////////////////////////
