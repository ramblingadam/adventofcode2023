//// https://adventofcode.com/2023/day/7

import { input } from './input'

const sampleInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

//// PLANNING
/*
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483

smells like... map each hand, push to array, sort the array

first, map all hands to the following format:
type Hand = {
  cards: string
  type: HandType  
}

we'll need to interpret the cards first to determine the handtype.
type Cards = {
  card: numOfOccurences
}

fiveOfAKind: any card that occurs 5 times:
  - true if count of any card is 5

fourOfAKind: any card that appears 4 times.
  - true is count of any card is 4

fullHouse: 3 of one card, 2 of another:
  - true if:
    - count of one card is 3
    - count of another card is 2

threeOfAKind: any card that appears 3 times
  - true if count of any card is 3

twoPair: two separate cards appear twice
  -true if:
    - count of any one card is 2, AND
    - count of any one OTHER card is 2
    (track with totalPairs?)

highCard: 
  - true if:
    - none of the above HandTypes are true


  IN THE END, we need to return the SUM of each hand's (RANK * BID)

  We'll use a sorted array to represent ranks from lowest to highest, where a hands rank is index + 1

*/

const CARD_STRENGTHS: Record<string, number> = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  '9': 8,
  '8': 7,
  '7': 6,
  '6': 5,
  '5': 4,
  '4': 3,
  '3': 2,
  '2': 1,
}

type HandType =
  | '5 of a kind'
  | '4 of a kind'
  | 'full house'
  | '3 of a kind'
  | '2 pair'
  | '1 pair'
  | 'high card'

const HAND_TYPE_STRENGTHS = {
  '5 of a kind': 7,
  '4 of a kind': 6,
  'full house': 5,
  '3 of a kind': 4,
  '2 pair': 3,
  '1 pair': 2,
  'high card': 1,
}

type Hand = {
  cards: string
  type: HandType
  bid: number
}

export const parseInput = (input: string) => {
  const handsAndBids = input.split(`\n`)

  const allHands: Hand[] = []

  handsAndBids.forEach((handAndBid) => {
    const [cards, bid] = handAndBid.split(' ')

    const cardCounts: Record<string, number> = cards
      .split('')
      .reduce((counts, card) => {
        if (counts[card] === undefined) counts[card] = 1
        else counts[card] = counts[card] + 1
        return counts
      }, {} as Record<string, number>)

    let handType: null | HandType = null

    let pairs = 0
    let triples = 0
    let highCardStrength = 0

    for (let card in cardCounts) {
      if (cardCounts[card] === 5) {
        handType = '5 of a kind'
        break
      }
      if (cardCounts[card] === 4) {
        handType = '4 of a kind'
        break
      }
      if (cardCounts[card] === 3) {
        triples += 1
      }
      if (cardCounts[card] === 2) {
        pairs += 1
      }
      highCardStrength = Math.max(highCardStrength, CARD_STRENGTHS[card])
    }
    if (!handType) {
      if (triples === 1 && pairs === 1) handType = 'full house'
      else if (triples === 1) handType = '3 of a kind'
      else if (pairs === 2) handType = '2 pair'
      else if (pairs === 1) handType = '1 pair'
      else handType = 'high card'
    }

    const handInfo: Hand = {
      cards: cards,
      type: handType,
      bid: +bid,
    }

    allHands.push(handInfo)
  })
  return allHands
}

console.log(parseInput(sampleInput))

export const sortHandsByRank = (allHands: Hand[]) => {
  return allHands.sort((a, b) => {
    const aStrength = HAND_TYPE_STRENGTHS[a.type]
    const bStrength = HAND_TYPE_STRENGTHS[b.type]

    if (aStrength === bStrength) {
      for (let i = 0; i < a.cards.length; i++) {
        const aCardStrength = CARD_STRENGTHS[a.cards[i]]
        const bCardStrength = CARD_STRENGTHS[b.cards[i]]
        if (aCardStrength > bCardStrength) return 1
        else if (bCardStrength > aCardStrength) return -1
      }
    }

    return aStrength - bStrength
  })
}

console.log(sortHandsByRank(parseInput(sampleInput)))

export const calculateTotalWinnings = (input: string): number => {
  const allHands = parseInput(input)
  const handsRankedByIndex = sortHandsByRank(allHands)
  return handsRankedByIndex.reduce((totalWinnings, hand, i) => {
    return (totalWinnings += hand.bid * (i + 1))
  }, 0)
}

// console.log(calculateTotalWinnings(sampleInput))

//// VICTORY!
console.log(calculateTotalWinnings(input))
