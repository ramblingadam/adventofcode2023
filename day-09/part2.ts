//// https://adventofcode.com/2023/day/9

import { input } from './input'

const sampleInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

//// PLANNING
/*
do the same thing but backwards. should be easy to change part 1 solution to handle it

*/

type History = Record<string, number[] | number> & { size: number }

export const parseInput = (input: string) => {
  const allHistories: History[] = []

  input.split(`\n`).forEach((historyLine) => {
    const historyArray: number[] = historyLine.split(' ').map((value) => +value)
    allHistories.push(buildRows(historyArray))
  })
  return allHistories
}

export const buildRows = (
  inputRow: number[],
  rowNumber: number = 1,
  history: History = { size: 0 }
): History => {
  history[rowNumber] = inputRow
  history.size += 1
  if (inputRow.every((value) => value === 0)) return history
  // console.log(inputRow)
  const newRow: number[] = []
  for (let i = 0; i < inputRow.length - 1; i++) {
    const curr = inputRow[i]
    const next = inputRow[i + 1]
    const difference = next - curr
    newRow.push(difference)
    // console.log(newRow)
  }

  return buildRows(newRow, rowNumber + 1, history)
  // return history
}

// console.log(buildRows([0, 3, 6, 9, 12, 15]))
// console.log(buildRows([1, 3, 6, 10, 15, 21]))
// console.log(buildRows([10, 13, 16, 21, 30, 45]))

// console.log(parseInput(sampleInput))

export const calculatePrevValue = (history: History) => {
  for (let row = history.size; row >= 1; row--) {
    if (row === history.size) (history[row] as number[]).unshift(0)
    else {
      const currentRow = history[row] as number[]
      const belowRow = history[row + 1] as number[]

      const firstValue = currentRow[0]
      const belowRowFirstValue = belowRow[0]

      const newValue = firstValue - belowRowFirstValue

      currentRow.unshift(newValue)
      if (row === 1) return newValue
    }
  }
  return 0
}

// console.log(calculateNextValue(buildRows([0, 3, 6, 9, 12, 15])))
// console.log(calculateNextValue(buildRows([1, 3, 6, 10, 15, 21])))
// console.log(calculateNextValue(buildRows([10, 13, 16, 21, 30, 45])))

export const sumOfAllExtrapolatedValues = (input: string) => {
  const allHistories = parseInput(input)
  return allHistories
    .map((history) => calculatePrevValue(history))
    .reduce((acc, curr) => acc + curr)
}

console.log(sumOfAllExtrapolatedValues(sampleInput))

//// VICTORY
console.log(sumOfAllExtrapolatedValues(input))
