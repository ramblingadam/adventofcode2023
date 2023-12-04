//// https://adventofcode.com/2023/day/4

import { input } from './input'

const sampleInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

//// PLANNING
/*

PARAMETERS: a string in the format presented in the sampleInput above.

Each card has two sets of numbers, separated by a pipe:
Left of the pipe is a list of WINNING NUMBERS.
Right of the pipe is a list of OWNED NUMBERS.

RETURN: the SUM of the score of all cards in the input.

To determine the total points for any card:
- The first match is worth 1 point.
- Each match thereafter doubles the total points.
- Therefore, a card with 3 matches is worth 4 points
  -1st match: 1 point. 2nd match: 1 x 2 = 2 points. 3rd match: 2 x 2 = 4 points.
- In other words:
  - First match is worth 1 point.
  - For every match past the first, double the previous score.

To parse the input:

.split on ': '
.split result on ' | '
const [winners, owned] = 


*/

export const calculateScore = (matches: number): number => {
  if (matches === 0) return 0
  let score = 1
  for (let i = 2; i <= matches; i++) {
    score *= 2
  }
  return score
}

console.log(calculateScore(0), 0)
console.log(calculateScore(1), 1)
console.log(calculateScore(2), 2)
console.log(calculateScore(3), 4)
console.log(calculateScore(4), 8)
console.log(calculateScore(5), 16)
console.log(calculateScore(6), 32)

export const totalPoints = (input: string): number => {
  const cards = input.split('\n')

  return cards.reduce((acc: number, card: string) => {
    //// Break up each card string into arrays of winning numbers and owned numbers.
    const numbers = card.split(': ')[1]
    const winners = numbers
      .split(' | ')[0]
      .split(' ')
      .filter((numStr) => numStr.length !== 0)
      .map((numStr) => +numStr)
    const owned = numbers
      .split(' | ')[1]
      .split(' ')
      .filter((numStr) => numStr.length !== 0)
      .map((numStr) => +numStr)

    // console.log(winners, owned)

    //// Compare the arrays to countthe number of matches.
    let matches = 0
    winners.forEach((winner) => {
      if (owned.includes(winner)) matches += 1
    })

    const score = calculateScore(matches)

    return acc + score
  }, 0)
}

console.log(totalPoints(sampleInput), 13)

//// Victory!
console.log(totalPoints(input), 25004)
