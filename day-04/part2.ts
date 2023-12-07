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
- map out how many cards each card adds
- first make a map of number of wins in each card
{
  1: 4,
  2: 2,
  3: 2,
  4: 1,
  5: 0
}
- for each card:
-- add the total wins of the next x cards, where x is the number of wins
-- then, for each of these x cards, also add the total wins of THEIR next x cards

*/

//// Utility function to count wins per card
export const totalWinsPerCard = (card: string) => {
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

  //// Compare the arrays to countthe number of matches.
  let matches = 0
  winners.forEach((winner) => {
    if (owned.includes(winner)) matches += 1
  })
  return matches
}

export const countCards = (input: string): number => {
  //// Build map of wins in each card
  const allCardWins: Record<string, number> = {}

  const cards = input.split('\n')
  cards.forEach((card: string) => {
    const cardNumber = card.replace('Card', '').split(':')[0].trim()
    const wins = totalWinsPerCard(card)
    console.log(cardNumber, wins)
    allCardWins[cardNumber] = wins
  })

  const allCardWinsArray: [string, number][] = Object.entries(allCardWins)

  let totalCards = cards.length

  const recurse = (cardNum: number, cardWins: number): number => {
    if (cardWins === 0) return 0
    let cardsToAdd = 0
    for (let i = cardNum; i < cardNum + cardWins; i++) {
      cardsToAdd += 1 + recurse(+allCardWinsArray[i][0], allCardWinsArray[i][1])
    }
    return cardsToAdd
  }

  for (let card in allCardWins) {
    totalCards += recurse(+card, allCardWins[card])
  }

  return totalCards
}

// console.log(countCards(sampleInput))

//// VICTORY
console.log(countCards(input))
