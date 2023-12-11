//// https://adventofcode.com/2023/day/5

import { input } from './input'

const sampleInput = `Time:      7  15   30
Distance:  9  40  200`

//// PLANNING
/*
given a time and a distance, return the number of ways that the record can be beat.

Time:      7  15   30
Distance:  9  40  200

Case 1: 7 millisecond race, 9 milliseconds record distance.
every second spent holding button down increases boats speed by 1 millimeter/ms.
let ms = time
let speed = 0
for(let i = 0; i < ms; i ++) {

}

*/

type RaceData = {
  time: number
  recordDistance: number
}

export const parseInput = (input: string) => {
  const allRaceData: Record<string, RaceData> = {}

  const times = input
    .split(`\n`)[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .filter((item) => item.trim() !== '')
    .map((num) => +num)
  const distances = input
    .split(`\n`)[1]
    .split(':')[1]
    .trim()
    .split(' ')
    .filter((item) => item.trim() !== '')
    .map((num) => +num)
  // console.log(times, distances)
  times.forEach((time, i) => {
    allRaceData[i] = { time: time, recordDistance: distances[i] }
  })
  return allRaceData
}

console.log(parseInput(sampleInput))

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

// console.log(waysToBeatRecord(parseInput(sampleInput)[1]))

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
