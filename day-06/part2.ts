//// https://adventofcode.com/2023/day/6

import { input } from './input'

const sampleInput = `Time:      7  15   30
Distance:  9  40  200`

//// PLANNING
/*
given a time and a distance, return the number of ways that the record can be beat.

Time:      7  15   30
Distance:  9  40  200
Now there is actually only 1 race! remove the spaces between the numbers.
So time for that race, given above example, is: 71530 and distance is 940200

all we need to do is change how we parse the input a bit

*/

type RaceData = {
  time: number
  recordDistance: number
}

export const parseInput = (input: string) => {
  const allRaceData: Record<string, RaceData> = {}

  const time = input
    .split(`\n`)[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .filter((item) => item.trim() !== '')
    .reduce((acc, curr) => (acc += curr))
  const distance = input
    .split(`\n`)[1]
    .split(':')[1]
    .trim()
    .split(' ')
    .filter((item) => item.trim() !== '')
    .reduce((acc, curr) => (acc += curr))

  allRaceData[0] = {
    time: +time,
    recordDistance: +distance,
  }

  return allRaceData
}

// console.log(parseInput(sampleInput))

export const waysToBeatRecord = (race: RaceData) => {
  let waysToBeatRecord = 0
  let speed = 0
  let timeRemaining = race.time
  for (let buttonHoldTime = 1; buttonHoldTime < race.time; buttonHoldTime++) {
    speed += 1
    timeRemaining -= 1
    const raceDistance = speed * timeRemaining
    if (raceDistance > race.recordDistance) waysToBeatRecord += 1
  }
  return waysToBeatRecord
}

// console.log(waysToBeatRecord(parseInput(sampleInput)[0]))

export const beatBoatRaceRecord = (input: string) => {
  const allRaceData = parseInput(input)

  let allWaysToBeatRecords: number[] = []

  for (let raceData in allRaceData) {
    const race = allRaceData[raceData]

    allWaysToBeatRecords.push(waysToBeatRecord(race))
  }
  return allWaysToBeatRecords.reduce((acc, curr) => acc * curr)
}

console.log(beatBoatRaceRecord(sampleInput))

//// VICTORY
console.log(beatBoatRaceRecord(input))
