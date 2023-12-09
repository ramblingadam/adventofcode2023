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
Part 2 specifies that initla seeds line now represents a range of seed numbers.
In seeds: 79 14 55 13:
  - first range of nums starts at 79 and contains 14 values, ending at 92.
  - second range starts at 55 and contains 13 values, ending at 67

Problem still essentially the same as part 1- just need to check every seed in the ranges given. Mega input has giant numbers so might take a minute, lol. 

Change seeds parsing to return an array of objects like so:
[
  {
    seedStart: number,
    seedMax: number
  }
]

Should change location array at the end to be a number variable and just use Math.min after each seed finds its location number

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

  //// CHANGED FROM PART 1:
  class SeedRange {
    seedStart: number
    seedMax: number
    constructor(seedStart: number, range: number) {
      this.seedStart = seedStart
      this.seedMax = seedStart + (range - 1)
    }
  }

  const seeds: SeedRange[] = []
  const allSeedNums = splitByMap[0]
    .split(': ')[1]
    .split(' ')
    .map((seed) => +seed)

  for (let i = 0; i < allSeedNums.length; i += 2) {
    seeds.push(new SeedRange(allSeedNums[i], allSeedNums[i + 1]))
  }

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
  const result: [SeedRange[], ParsedMap[]] = [seeds, allMaps]
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
  const startTime = Date.now()
  const [seeds, allMaps] = parseInput(input)

  let lowestLocation: number = Infinity

  seeds.forEach((seedRange, i) => {
    const seedStart = Date.now()
    for (
      let seedNum = seedRange.seedStart;
      seedNum <= seedRange.seedMax;
      seedNum++
    ) {
      let source = seedNum
      allMaps.forEach((map) => {
        const destination = sourceToDestination(source, map)
        source = destination
      })
      lowestLocation = Math.min(lowestLocation, source)
    }
    const totalTimeInMs = Date.now() - seedStart
    const totalTimeInSeconds = totalTimeInMs / 1000
    const totalTimeInMinutes = totalTimeInSeconds / 60
    console.log(`Seedrange ${i} completed in ${totalTimeInMs}ms`)
    console.log(totalTimeInSeconds, 'seconds')
    console.log(totalTimeInMinutes, 'minutes')
  })

  const totalTimeInMs = Date.now() - startTime
  const totalTimeInSeconds = totalTimeInMs / 1000
  const totalTimeInMinutes = totalTimeInSeconds / 60
  console.log(`Total time: ${totalTimeInMs}ms`)
  console.log(totalTimeInSeconds, 'seconds')
  console.log(totalTimeInMinutes, 'minutes')
  return lowestLocation
}

console.log(seedLocations(sampleInput), 46)

//// VICTORY
console.log(seedLocations(input))
