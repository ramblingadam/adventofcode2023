//// https://adventofcode.com/2023/day/5

import { input } from './input'

const sampleInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

//// PLANNING
/*
convert string into something usable:
seeds = [1, 2, 3]
seedsToSoil = [
  [50, 98, 2],
  [52, 50, 48]
]
etc.

OR MAYBE

seedsToSoil = [
  {
    sourceStart: 98,
    sourceMax: sourceStart + (rangeLength - 1)
    destinationStart: 50,
    destinationMax: destinationStart + (rangeLength - 1)
    rangeLength: 2
  },
  {
    sourceStart: 50,
    destinationStart: 52,
    rangeLength: 48
  },
]

each seed needs to move through each map ONE BY ONE until finally reaching its destination. note that any soruce numbers that aren't mapped to a destination have the same destination number.


for each seedNum(or any source), return the destination::
  1. seedsToSoil:
    if(seedNum >= seedToSoil[row].sourceStart
      && seedNum <= seedToSoil[row].sourceMax) {
      return seedToSoil[row].destinationStart + (seedNum - sourceStart)
    } else return seedNum

    2. Take destination from previous map and pass it into the new map as a source
    3. etc
    4. profit

so full process:
    - init a master map array to hold all of our parsed map arrays
    - parse the input into format noted above. each map is an array of objects, where each row in the map is an object specifying/naming the important numbers for ease of understanding
    - input source numbers, starting with a seed number, into each map one by one, passing result from previous destination as source into the next until we reach the end
*/

class MapRow {
  sourceStart: number
  sourceMax: number
  destinationStart: number
  destinationEnd: number
  constructor(sourceStart: number, destinationStart: number, range: number) {
    this.sourceStart = sourceStart
    this.sourceMax = sourceStart + (range - 1)
    this.destinationStart = destinationStart
    this.destinationEnd = destinationStart + (range - 1)
  }
}

type ParsedMap = MapRow[]

//// Helper function to parse input string into the format: [seeds:number[]], allMaps: ParsedMap[]]
export const parseInput = (input: string) => {
  const splitByMap = input.split('\n\n')

  const seeds: number[] = splitByMap[0]
    .split(': ')[1]
    .split(' ')
    .map((seed) => +seed)

  const allMaps: ParsedMap[] = []

  splitByMap.slice(1).forEach((map) => {
    const parsedMap: MapRow[] = []
    map
      .split('\n')
      .slice(1)
      .forEach((row) => {
        // console.log(row)
        const mapData = row.split(' ')
        const sourceStart = mapData[1]
        const destinationStart = mapData[0]
        const range = mapData[2]
        parsedMap.push(new MapRow(+sourceStart, +destinationStart, +range))
      })
    allMaps.push(parsedMap)
  })
  // console.log(allMaps)
  const result: [number[], ParsedMap[]] = [seeds, allMaps]
  return result
}

//// Helper function that takes in a source and a map and returns the final destination per puzzle rules.
export const sourceToDestination = (source: number, map: ParsedMap) => {
  //// Iterate through each row in the map, checking if the source number is within that rows source range. If we reach the end without finding one, return the soruce number as the destination. Otherwise, return the appropriate destination, which will be: destinationStart + (source - SourceStart)
  let destination: number = source

  for (let i = 0; i < map.length; i++) {
    const row = map[i]
    if (source >= row.sourceStart && source <= row.sourceMax) {
      destination = row.destinationStart + (source - row.sourceStart)
      break
    }
  }
  return destination
}

//// Bring it all together.
export const seedLocations = (input: string) => {
  const [seeds, allMaps] = parseInput(input)

  const finalLocations: number[] = []

  seeds.forEach((seed) => {
    let source = seed
    allMaps.forEach((map) => {
      const destination = sourceToDestination(source, map)
      source = destination
    })
    finalLocations.push(source)
  })

  return Math.min(...finalLocations)
}

console.log(seedLocations(sampleInput), 35)

console.log(seedLocations(input))
