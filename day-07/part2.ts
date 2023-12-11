//// https://adventofcode.com/2023/day/7

import { input } from './input'

const sampleInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

//// PLANNING
/*
New wrench: Jokers are no included, and pretend to be whatever card is needed to make the current hand the best hand possible given the other cards in  that hand.

Jokers individual strength is now the lowest.

we'll need to refactor our parseInput handType calculations to include the following cases:

TESTS:
QAJJJ > QAAAA = four of a kind
QQAAJ > QQAAA = full house
QQQJJ > QQQQQ = five of a kind
QQJJJ > QQQQQ = five of a kind
QQJ12 > QQQ12 = 3 of a kind
1233J > 12333 = 3 of a kind
1234J > 12344 = 1 pair

HAND UPGRADE SCENARIOS:
5 of a kind:
- 4 of a card and 1 joker
- one triple and 2 jokers
- one pair and 3 jokers
- 1 of a card and 4 jokers

4 of a kind:
- one triple and 1 jokers
- one pair and 2 jokers
- 1 of a card and 3 jokers

QAJJJ > QAAAA = four of a kind
QQAAJ > QQAAA = full house
QQQJJ > QQQQQ = five of a kind
QQJJJ > QQQQQ = five of a kind
QQAJJ > QQAQQ = four of a kind

QQ
full house:
- 2 pairs and 1 joker

QQJ12 > QQQ12 = 3 of a kind
123JJ > 12333 = 3 of a kind
3 of a kind:
- 1 pair and 1 joker
- 0 pairs and 2 jokers

1234J > 1 pair
1233J > 3 of a kind

2 pair:
- None. Any cases where a joker could upgrade a hand to a two pair, it could instead upgrade the hand to 3 of a kind or better.

1234J > 12344
1 pair:
- no pairs, no triples, 1 joker

high card:
- No new rules involving joker. A single joker will always at minimum upgrade a hand to a 1 pair.



*/

const CARD_STRENGTHS: Record<string, number> = {
  A: 13,
  K: 12,
  Q: 11,
  T: 9,
  '9': 8,
  '8': 7,
  '7': 6,
  '6': 5,
  '5': 4,
  '4': 3,
  '3': 2,
  '2': 1,
  J: 0,
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
    let jokers = 0 | cardCounts['J']

    for (let card in cardCounts) {
      if (card === 'J') {
        if (jokers === 5) handType = '5 of a kind'
        continue
      }
      const cardCount = cardCounts[card]
      if (cardCount + jokers === 5) {
        handType = '5 of a kind'
        break
      }
      if (cardCount + jokers === 4) {
        handType = '4 of a kind'
        break
      }
      if (cardCount === 3) {
        triples += 1
      }
      if (cardCount === 2) {
        pairs += 1
      }
    }
    if (!handType) {
      if (triples === 1 && pairs === 1) {
        handType = 'full house'
      } else if (triples === 1) {
        handType = '3 of a kind'
      } else if (pairs === 2) {
        if (jokers === 1) handType = 'full house'
        else handType = '2 pair'
      } else if (pairs === 1) {
        if (jokers === 1) handType = '3 of a kind'
        else handType = '1 pair'
      } else {
        if (jokers === 2) handType = '3 of a kind'
        else if (jokers === 1) handType = '1 pair'
        else handType = 'high card'
      }
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

// console.log(parseInput(sampleInput))

// let tests = [
//   ['QAJJJ 69', 'four of a kind'],
//   ['QQAAJ 69', 'full house'],
//   ['QQQJJ 69', 'five of a kind'],
//   ['QQJJJ 69', 'five of a kind'],
//   ['QQ12J 69', 'three of a kind'],
//   ['123JJ 69', 'three of a kind'],
//   ['1234J 69', '1 pair'],
//   ['1233J 69', 'three of a kind'],
//   ['1214J 69', 'three of a kind'],
//   ['J1234 69', '1 pair'],
//   ['QQAJJ 69', '4 of a kind'],
// ]

// for (let test of tests) {
//   console.log(parseInput(test[0]), test[1])
// }

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

// console.log(sortHandsByRank(parseInput(sampleInput)))

export const calculateTotalWinnings = (input: string): number => {
  const allHands = parseInput(input)
  const handsRankedByIndex = sortHandsByRank(allHands)
  return handsRankedByIndex.reduce((totalWinnings, hand, i) => {
    return (totalWinnings += hand.bid * (i + 1))
  }, 0)
}

// console.log(calculateTotalWinnings(sampleInput))

//// VICTORY
console.log(calculateTotalWinnings(input))
