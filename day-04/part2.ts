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
The number of matches on a card is no longer directly relevant to your score.

The number of matches on any particular card now means that you give yourself new copies of the next n cards, where n is the number of matches on the card.
 - Card 1, above, has 4 matches, you get a new copy of card 2, 3, 4, and 5.
 - Card 2, with 2 matches, nets you a new copy of cards 3 and 4
 - etc.

RETURN: Now, your score is determined by the total number of cards you have at the end, after processing every single card- including your new copies.

Memoization may be useful at some point here.

One idea:
Make a map of cards by number: 
{
  1: [winners, owned],
  2: [winners, owned],
  ...n: [winners, owned]
}

Second idea:
Not exactly efficient, but could use a for loop and continually splice in added cards, returning the length at the end.

THIS ISN'T WORKING and i'm not sure why


*/

export const totalCards = (input: string): number => {
  //// Keep
  const cards = input.split('\n')
  let ourCards = cards.slice()

  for (let cardInd = 0; cardInd < ourCards.length; cardInd++) {
    const numbers = ourCards[cardInd].split(': ')[1]
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

    // console.log(winners)
    // console.log(owned)

    //// Compare the arrays to count the number of matches.
    let matches = 0
    winners.forEach((winner) => {
      if (owned.includes(winner)) matches += 1
    })

    console.log('current card at cardind:', ourCards[cardInd])
    console.log('spot to insert:', cardInd + 1)

    // ourCards.splice(
    //   cardInd + 1,
    //   0,
    //   ...cards.slice(cardInd + 1, cardInd + 1 + matches)
    // )
    ourCards = ourCards.concat(
      ...cards.slice(cardInd + 1, cardInd + 1 + matches)
    )
    console.log('matches:', matches)
    console.log(
      'cards to insert:',
      cards.slice(cardInd + 1, cardInd + 1 + matches)
    )
    console.log('ourCards after splice:', ourCards)
    console.log('-------------------------')
  }
  // ourCards.splice(1, 0, cards[1])
  console.log(ourCards)
  const cardCounter = ourCards.reduce(
    (acc: Record<string, number>, card: string) => {
      const cardNum = card.split(': ')[0]
      if (acc[cardNum] === undefined) acc[cardNum] = 1
      else acc[cardNum] += 1
      return acc
    },
    {}
  )

  console.log(cardCounter)

  return ourCards.length
}

// export const totalCards = (input: string): number => {
//   //// Keep
//   const cards = input.split('\n')
//   let ourCards = cards.slice()

//   for (let cardInd = 0; cardInd < ourCards.length; cardInd++) {
//     const numbers = ourCards[cardInd].split(': ')[1]
//     const winners = numbers
//       .split(' | ')[0]
//       .split(' ')
//       .filter((numStr) => numStr.length !== 0)
//       .map((numStr) => +numStr)
//     const owned = numbers
//       .split(' | ')[1]
//       .split(' ')
//       .filter((numStr) => numStr.length !== 0)
//       .map((numStr) => +numStr)

//     // console.log(winners)
//     // console.log(owned)

//     //// Compare the arrays to count the number of matches.
//     let matches = 0
//     winners.forEach((winner) => {
//       if (owned.includes(winner)) matches += 1
//     })

//     console.log('spot to insert:', cardInd)
//     console.log('card at cardind:', ourCards[cardInd])

//     ourCards.splice(
//       cardInd + 1,
//       0,
//       ...cards.slice(cardInd + 1, cardInd + 1 + matches)
//     )
//     console.log('matches:', matches)
//     console.log(
//       'cards to insert:',
//       cards.slice(cardInd + 1, cardInd + 1 + matches)
//     )
//     console.log('ourCards after splice:', ourCards)
//     console.log('-------------------------')

//     // ourCards = ourCards.concat(
//     //   ...cards.slice(cardInd + 1, cardInd + 1 + matches)
//     // )
//   }
//   // ourCards.splice(1, 0, cards[1])
//   console.log(ourCards)
//   const cardCounter = ourCards.reduce(
//     (acc: Record<string, number>, card: string) => {
//       const cardNum = card.split(': ')[0]
//       if (acc[cardNum] === undefined) acc[cardNum] = 1
//       else acc[cardNum] += 1
//       return acc
//     },
//     {}
//   )

//   console.log(cardCounter)

//   return ourCards.length + cards
// }

console.log(totalCards(sampleInput), 30)

// console.log(totalCards(input))
