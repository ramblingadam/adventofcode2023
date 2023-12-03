// you walk, the Elf shows you a small bag and some cubes which are either red, green, or blue. Each time you play this game, he will hide a secret number of cubes of each color in the bag, and your goal is to figure out information about the number of cubes.

// To get information, once a bag has been loaded with cubes, the Elf will reach into the bag, grab a handful of random cubes, show them to you, and then put them back in the bag. He'll do this a few times per game.

// You play several games and record the information from each game (your puzzle input). Each game is listed with its ID number (like the 11 in Game 11: ...) followed by a semicolon-separated list of subsets of cubes that were revealed from the bag (like 3 red, 5 green, 4 blue).

// For example, the record of a few games might look like this:

// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green

// In game 1, three sets of cubes are revealed from the bag (and then put back again). The first set is 3 blue cubes and 4 red cubes; the second set is 1 red cube, 2 green cubes, and 6 blue cubes; the third set is only 2 green cubes.

// The Elf would first like to know which games would have been possible if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?

// In the example above, games 1, 2, and 5 would have been possible if the bag had been loaded with that configuration. However, game 3 would have been impossible because at one point the Elf showed you 20 red cubes at once; similarly, game 4 would also have been impossible because the Elf showed you 15 blue cubes at once. If you add up the IDs of the games that would have been possible, you get 8.

// Determine which games would have been possible if the bag had been loaded with only 12 red cubes, 13 green cubes, and 14 blue cubes. What is the sum of the IDs of those games?

/*
take in two params:
1st param: a string of games, each game separated by a newline. each game has an ID - game 1's id is 1, etc
each game is a series of cubes drawn in the format:
 numberOfCube1 colorOfCube1, numOfCube2 colorOfCube2, etc. - each draw separated by semicolons

2nd param: a collection of numbers and colors representing the total amount of cubes in the bag. (puzzle leaves it open, let's use an object for this param)
for example: {red: 12, green: 13, blue: 14}.

return the SUM of all game IDs where the second param is a possible total number of cubes in the bag.

split all games by newline
reduce: acc starts at 0, curr is a game
  split the current game by semicolon to get the draws
  reduce each draw into a boolean: true if possible given param 2, false if not
    to confirm if a given draw is possible:
    make an object to store colors and numbers
    split the draw into colors on ', '
      split those colors into numbers and colors on ' '
      add colors and nums to the object
    loop through our new object:
      compare to param 2:
        if a color is NOT in param 2, fail it
        is the value for a color is greater than the value for that same color in param2, fail it
        if we reach the end of the loop with no fails, pass it! move on to next draw
    if all draws for a game pass, then add the id of that game to the accumulator()

*/

export const possibleGames = (
  allGames: string,
  target: Record<string, number> //// i.e. {red: 12, green: 13, blue: 5},
) => {
  //// Split the main input on newlines so we can reduce all games to a sum of valid game IDs
  return allGames.split(`\n`).reduce((acc: number, curr: string) => {
    //// Split the game on ': ' to get its identifier and draws separated
    const game: string[] = curr.split(': ')
    //// Grab the game ID and convert it into a number for adding to accumulator if game passes checks.
    const gameID: number = +game[0].split(' ')[1]
    //// Grab the draws.
    const draws = game[1]

    //// The value of 'possible' will be true if the given game is a possible result given the target parameter.
    //// We will split each collection of draws into an individual draw to check ifthat draw is possible.
    //// Accumulator starts as true. If at any point we find a draw that is NOT possible, we change our acc to false.
    const possible: boolean = draws
      .split('; ')
      .reduce((isValidGame: boolean, draw: string) => {
        //// Init a map to convert the draw string into a more useful structure for comparing to our target parameter.
        const drawMap: Record<string, number> = {}
        //// Fill out our map. {green: 12, red: 6}, etc.
        draw.split(', ').forEach((cubeSet: string) => {
          const splitSet = cubeSet.split(' ')
          drawMap[splitSet[1]] = +splitSet[0]
        })
        //// Compare our map for this draw to the target. If at any point we find aa color that does not exist in the target, or we have drawn a larger number of cubes of a particular color than that target has, change accumulator to false.
        for (let color in drawMap) {
          if (!target[color] || target[color] < drawMap[color]) return false
        }
        //// If we made it this far, return the current accumulator value. This will be true if none of our draws have failed- or it will be false if ANY of our draws have failed at any point.
        return isValidGame
      }, true)

    //// If the given game is possible, great! Add the game ID to our overall accumulator.
    if (possible) return acc + gameID
    else return acc
  }, 0)
}

/*
PART 2:
in each game, what is the FEWEST number of cubes of each color to make each game possible?
the result should be given as the POWER: which is the number of red, green, and blue cubes multiplied together.
the final result, we want the SUM of all POWERS across all games.

find the largest number of cubes of each color among the draws in a game.
as we look at each game, init an object smallest = {red: 0, green: 0, blue: 0}
after we've mapped out each draw, compare the values to our smallest. If the value for any color is larger than the current smallest value, overwrite that smallest value.
after going through all draws, multiply all smallest values together, and add to an accumulator

*/

export const totalCubePower = (allGames: string) => {
  //// Split the main input on newlines so we can reduce all games to cube set power.
  return allGames.split(`\n`).reduce((acc: number, curr: string) => {
    //// Split the game on ': ' to get its identifier and draws separated
    const game: string[] = curr.split(': ')
    //// Grab the draws for the current game.
    const draws = game[1]

    const fewestPossible: Record<string, number> = {
      red: 0,
      green: 0,
      blue: 0,
    }

    draws.split('; ').forEach((draw: string) => {
      //// Init a map to convert the draw string into a more useful structure
      const drawMap: Record<string, number> = {}
      //// Fill out our map. {green: 12, red: 6}, etc.
      draw.split(', ').forEach((cubeSet: string) => {
        const splitSet = cubeSet.split(' ')
        drawMap[splitSet[1]] = +splitSet[0]
      })
      //// Compare our map to the fewestPossible map.
      for (let color in drawMap) {
        fewestPossible[color] = Math.max(fewestPossible[color], drawMap[color])
      }
    })

    const cubePower =
      fewestPossible['red'] * fewestPossible['green'] * fewestPossible['blue']

    return acc + cubePower
  }, 0)
}

export const solvePuzzles = (
  allGames: string,
  target: Record<string, number>
) => {
  const part1 = possibleGames(allGames, target)
  const part2 = totalCubePower(allGames)
  return `Total possible games: ${part1}\nTotalCubePower: ${part2}`
}

console.log(
  possibleGames(
    `Game 1: 12 blue; 2 green, 13 blue, 19 red; 13 red, 3 green, 14 blue
Game 2: 12 blue, 1 red, 1 green; 1 red, 12 blue, 3 green; 5 green, 1 red, 9 blue; 1 red, 7 blue, 4 green
Game 3: 1 red; 12 blue, 15 red; 1 green, 10 red, 2 blue; 1 green, 3 red, 9 blue
Game 4: 6 blue, 5 green; 2 blue, 6 green, 6 red; 11 blue, 5 red; 6 green, 11 red, 7 blue; 4 green, 10 red; 1 green, 7 red, 13 blue
Game 5: 10 green, 1 red, 2 blue; 3 red, 4 green, 4 blue; 5 green, 5 red`,
    { red: 12, green: 13, blue: 14 }
  )
)

console.log(
  solvePuzzles(
    `Game 1: 12 blue; 2 green, 13 blue, 19 red; 13 red, 3 green, 14 blue
Game 2: 12 blue, 1 red, 1 green; 1 red, 12 blue, 3 green; 5 green, 1 red, 9 blue; 1 red, 7 blue, 4 green
Game 3: 1 red; 12 blue, 15 red; 1 green, 10 red, 2 blue; 1 green, 3 red, 9 blue
Game 4: 6 blue, 5 green; 2 blue, 6 green, 6 red; 11 blue, 5 red; 6 green, 11 red, 7 blue; 4 green, 10 red; 1 green, 7 red, 13 blue
Game 5: 10 green, 1 red, 2 blue; 3 red, 4 green, 4 blue; 5 green, 5 red
Game 6: 1 green, 6 blue, 14 red; 9 blue, 5 red; 14 red, 12 blue
Game 7: 1 green, 9 red, 8 blue; 9 blue, 1 green, 6 red; 1 green, 15 blue, 19 red
Game 8: 9 red, 7 green, 2 blue; 6 red, 17 green; 18 red, 16 green, 2 blue; 10 red, 14 green
Game 9: 1 blue, 11 red, 9 green; 8 red, 1 blue, 9 green; 4 blue, 16 red, 9 green; 8 green, 3 blue, 6 red; 8 green, 11 red, 3 blue; 11 red, 2 blue
Game 10: 8 green, 14 blue; 1 red, 6 blue, 9 green; 6 blue, 4 green, 1 red; 16 green, 9 blue
Game 11: 6 green, 11 blue, 1 red; 10 green, 1 red; 7 blue, 2 green, 1 red
Game 12: 3 green, 5 blue, 2 red; 14 blue, 16 green, 4 red; 8 green, 14 blue, 4 red
Game 13: 5 red, 12 blue, 2 green; 2 green, 1 red, 9 blue; 1 red, 2 blue, 3 green; 3 green, 3 red, 7 blue; 2 red, 13 blue; 1 red, 10 blue, 2 green
Game 14: 5 blue, 1 red, 2 green; 8 blue, 1 green, 1 red; 1 blue, 2 green
Game 15: 14 blue, 9 green, 1 red; 2 red, 15 blue, 12 green; 1 blue, 2 green, 1 red; 1 red, 16 green, 15 blue; 1 red, 12 green, 8 blue; 1 red, 17 blue
Game 16: 7 red, 1 green, 18 blue; 7 blue, 5 green, 17 red; 14 blue, 8 red, 6 green
Game 17: 4 green, 5 blue; 5 green, 1 red, 7 blue; 3 green, 6 blue, 4 red; 2 green, 5 blue; 9 green, 6 red, 6 blue
Game 18: 8 red, 6 blue; 4 blue, 19 red; 4 blue, 9 red; 9 blue, 10 red; 2 green, 9 blue, 13 red; 3 blue, 7 red
Game 19: 8 green, 2 red, 17 blue; 11 blue, 4 red, 5 green; 8 blue, 8 green, 10 red; 9 green, 4 blue, 2 red; 4 green, 10 red, 6 blue
Game 20: 9 green, 3 blue, 1 red; 5 blue, 16 green, 3 red; 3 green, 3 red; 2 blue, 1 red, 5 green
Game 21: 7 green, 1 red, 10 blue; 7 green, 5 blue, 7 red; 7 green, 9 blue
Game 22: 5 red, 2 blue, 9 green; 6 red, 11 green; 6 green, 6 red
Game 23: 14 red, 2 blue, 9 green; 9 green, 1 blue, 4 red; 9 red, 1 green, 1 blue; 6 green; 3 blue, 1 green, 9 red; 1 blue, 2 red
Game 24: 3 red, 7 green, 6 blue; 1 green, 5 blue; 6 blue, 1 red, 2 green; 5 red, 1 blue, 4 green; 6 red, 2 blue, 11 green; 2 green, 2 red, 1 blue
Game 25: 5 green, 1 red, 3 blue; 3 blue, 6 green, 3 red; 3 red, 4 green, 1 blue; 6 green, 1 blue, 9 red; 2 blue, 2 red, 1 green
Game 26: 3 green, 4 red, 12 blue; 2 red, 1 green, 15 blue; 7 red, 16 green, 4 blue; 11 blue, 11 green, 3 red; 8 green, 15 blue, 10 red
Game 27: 9 red; 10 red, 2 blue; 3 red; 8 red, 1 green, 2 blue; 1 red, 2 blue; 1 blue, 4 red
Game 28: 5 blue, 8 red, 5 green; 10 blue, 4 red, 5 green; 8 red, 14 blue, 10 green; 10 blue, 4 red, 1 green; 5 red, 17 green, 4 blue
Game 29: 16 green, 11 red, 5 blue; 11 red, 14 blue, 13 green; 13 blue, 8 green; 3 red, 18 green, 15 blue
Game 30: 2 red, 4 blue, 8 green; 6 green, 2 red, 2 blue; 6 green, 6 blue, 2 red
Game 31: 2 red, 1 blue, 16 green; 10 green, 1 blue, 7 red; 1 blue, 14 green, 7 red; 2 blue, 1 green, 1 red; 6 red, 13 green; 2 blue, 6 red, 10 green
Game 32: 4 green, 4 blue; 1 green, 5 red; 6 green, 1 red; 3 green, 5 red, 2 blue; 4 red, 1 blue, 4 green; 6 green, 2 blue, 6 red
Game 33: 5 blue, 2 red, 1 green; 5 blue; 1 blue, 1 green, 10 red; 8 red, 3 blue, 1 green
Game 34: 15 blue, 7 green; 12 green, 17 blue; 10 blue, 11 green; 1 red, 5 blue, 9 green; 2 red, 10 blue, 11 green
Game 35: 2 red, 6 blue; 2 red, 5 blue, 4 green; 2 red, 8 green, 10 blue
Game 36: 4 red, 9 green, 3 blue; 4 red, 6 green; 6 red; 11 red, 4 green
Game 37: 3 blue, 12 green, 14 red; 3 red, 5 green, 7 blue; 2 blue, 2 green, 16 red
Game 38: 17 blue, 16 red, 8 green; 4 green, 17 blue, 4 red; 8 red, 7 blue, 6 green; 2 blue, 9 green, 17 red; 10 blue, 8 green, 11 red
Game 39: 10 blue, 1 red, 4 green; 4 green, 4 red, 6 blue; 11 blue
Game 40: 5 green, 17 blue; 11 blue, 4 green, 7 red; 2 green, 6 red, 13 blue; 7 blue, 12 green, 16 red; 15 red, 3 green, 8 blue; 12 green, 3 blue, 12 red
Game 41: 13 blue, 3 red, 1 green; 2 green, 10 red; 1 blue, 5 red, 3 green; 5 green, 16 blue; 9 blue, 2 green; 14 blue, 4 green, 5 red
Game 42: 2 blue, 15 green, 3 red; 3 red, 17 green; 6 red, 1 blue, 8 green
Game 43: 8 green, 9 red, 3 blue; 1 blue, 13 red; 5 red, 1 blue, 6 green; 2 red, 2 blue; 17 red, 2 blue, 6 green
Game 44: 10 red, 3 blue; 10 blue, 5 green; 4 red, 4 blue, 1 green; 16 blue, 6 red, 7 green; 3 green, 12 blue
Game 45: 12 blue, 2 red; 2 blue, 3 red, 2 green; 8 blue, 3 green; 4 green, 8 blue, 5 red; 3 red, 2 blue, 1 green; 1 red, 2 blue, 7 green
Game 46: 1 blue, 11 red, 6 green; 2 blue, 11 red, 6 green; 8 red, 5 green
Game 47: 2 blue, 9 red; 1 green, 5 blue; 10 red, 2 blue, 2 green; 10 red, 3 green, 3 blue; 3 red, 6 blue, 2 green; 1 red, 1 green, 5 blue
Game 48: 1 red, 7 green; 1 blue, 10 green, 5 red; 4 red, 8 green; 10 red, 10 green; 2 red, 16 green; 11 red, 14 green, 1 blue
Game 49: 1 red, 1 blue, 5 green; 6 green, 5 red; 3 blue, 4 red, 3 green; 3 red, 5 green, 2 blue; 3 blue, 3 red
Game 50: 17 red, 1 green, 7 blue; 4 blue, 1 red, 5 green; 10 red, 13 blue; 17 red
Game 51: 2 red, 1 green; 1 green, 10 blue, 2 red; 5 red, 1 green, 7 blue; 7 blue, 1 red; 9 blue, 5 red, 2 green
Game 52: 8 green, 1 blue; 14 green, 1 red; 10 green, 1 red
Game 53: 17 green, 6 blue; 17 blue, 9 green; 1 red, 12 blue
Game 54: 4 blue, 7 red, 9 green; 7 red, 2 green; 14 green, 10 red, 3 blue; 9 green, 6 blue, 5 red; 2 blue, 3 green, 11 red
Game 55: 11 green, 4 red; 14 green; 3 red, 3 green; 3 green, 4 red, 1 blue; 15 green, 6 red, 2 blue; 4 red, 3 blue, 15 green
Game 56: 8 blue, 5 red, 9 green; 11 green, 5 blue, 6 red; 1 green, 1 blue, 7 red; 7 green, 4 red, 1 blue; 9 blue, 5 red, 1 green; 5 red, 2 blue
Game 57: 11 green, 19 blue, 5 red; 15 green, 5 red, 18 blue; 16 green, 5 red, 10 blue; 19 blue, 3 red; 9 green, 8 blue
Game 58: 4 blue, 12 green; 11 green, 4 blue; 6 blue, 6 green; 1 red, 2 green; 11 green, 3 blue; 13 blue, 6 green
Game 59: 10 blue, 1 red; 1 green, 4 blue; 4 blue
Game 60: 7 red, 2 green, 6 blue; 1 green, 13 red, 12 blue; 9 blue, 9 green, 8 red
Game 61: 7 green, 3 red, 2 blue; 1 red, 1 blue; 5 green, 3 blue; 4 blue, 1 red, 4 green
Game 62: 1 green, 8 blue, 6 red; 7 blue, 3 red, 12 green; 2 blue, 7 red, 6 green
Game 63: 3 red, 2 green; 3 green, 4 blue, 9 red; 3 blue, 3 green, 16 red; 4 red, 1 blue
Game 64: 10 red, 2 green, 15 blue; 4 red, 14 green; 6 red, 14 green, 2 blue
Game 65: 11 red, 14 green, 5 blue; 7 blue, 14 green, 15 red; 1 blue, 14 green; 4 green, 4 blue, 7 red
Game 66: 6 blue, 9 green, 6 red; 6 blue, 2 red, 4 green; 3 blue; 8 blue, 5 green, 8 red; 17 blue, 11 green; 12 green, 11 blue, 4 red
Game 67: 8 red, 4 blue, 6 green; 4 blue, 8 red, 2 green; 1 green, 6 red, 2 blue; 10 red, 1 green, 2 blue; 1 blue, 5 red; 2 red, 1 green, 2 blue
Game 68: 10 green, 9 red, 13 blue; 2 blue, 2 green, 4 red; 11 red, 13 blue; 4 green, 2 red, 8 blue
Game 69: 16 red; 12 red, 1 green, 4 blue; 1 green, 14 red, 9 blue; 12 blue, 2 green, 13 red; 14 red, 2 green, 10 blue; 11 blue
Game 70: 1 red, 19 green; 4 blue, 6 green; 12 green, 2 red
Game 71: 9 green, 2 blue, 3 red; 5 red; 1 red, 1 blue, 5 green
Game 72: 1 green, 19 red; 12 red, 1 green, 1 blue; 16 red, 6 blue; 14 red, 7 blue; 11 blue, 1 green, 13 red; 16 blue, 4 red
Game 73: 1 green, 1 red, 2 blue; 8 green, 2 red, 4 blue; 7 blue, 7 green, 7 red
Game 74: 1 blue, 1 green; 1 red; 1 red, 5 blue, 4 green; 2 blue, 1 red; 1 blue
Game 75: 8 green, 1 red; 3 blue, 1 red, 5 green; 12 green
Game 76: 8 green, 6 red, 2 blue; 7 red, 1 blue; 2 blue, 9 green, 1 red; 8 red, 13 green; 12 green, 2 red; 7 green, 5 red
Game 77: 3 blue, 1 green, 10 red; 13 red; 1 blue, 13 red, 1 green
Game 78: 2 red, 3 green, 14 blue; 3 red, 16 blue, 6 green; 3 blue, 3 red, 9 green; 4 blue, 11 green; 6 green, 2 blue; 2 red, 10 green, 11 blue
Game 79: 5 green, 10 blue, 2 red; 16 green, 15 blue, 1 red; 1 red, 11 green; 1 red, 11 blue, 16 green; 7 blue, 18 green
Game 80: 9 blue, 10 green; 13 green, 9 blue; 1 red, 5 green, 5 blue; 13 green, 5 blue, 1 red
Game 81: 9 green, 15 red, 11 blue; 11 blue, 9 red, 5 green; 2 green, 11 blue, 19 red; 14 green, 15 red, 5 blue
Game 82: 4 green, 6 red, 13 blue; 5 blue, 5 red, 4 green; 2 green, 7 blue
Game 83: 12 blue, 8 red; 6 red, 1 blue, 1 green; 7 red, 1 green, 1 blue; 6 red, 1 green, 9 blue; 10 blue, 3 red; 1 red, 5 blue
Game 84: 9 blue, 13 red; 8 blue, 1 green; 9 blue, 1 green; 3 blue, 5 red, 1 green
Game 85: 14 green, 5 blue, 8 red; 1 blue, 5 green, 1 red; 10 red, 7 blue, 17 green; 3 blue, 6 green; 6 red, 5 blue, 4 green; 5 blue, 4 green, 6 red
Game 86: 14 red; 20 red, 3 blue; 1 green, 12 blue, 15 red; 16 red, 13 blue; 13 red, 12 blue; 2 blue, 20 red
Game 87: 2 blue, 2 red, 10 green; 8 green, 9 red, 1 blue; 11 red, 1 green, 4 blue; 13 red, 1 blue; 11 green, 16 red, 3 blue
Game 88: 5 green, 4 red, 1 blue; 3 blue, 8 red, 10 green; 11 green, 7 red, 4 blue; 11 green, 5 blue, 4 red; 9 red, 9 green; 4 blue, 6 green, 9 red
Game 89: 2 blue, 2 red, 5 green; 2 red, 2 blue, 3 green; 2 red, 1 blue, 7 green; 6 green, 1 red, 2 blue
Game 90: 4 green, 1 blue, 5 red; 2 blue, 2 red, 10 green; 2 green, 8 red, 1 blue; 10 green, 5 red; 2 red, 3 green, 2 blue
Game 91: 16 blue, 5 red, 15 green; 4 green, 7 red, 3 blue; 4 red, 8 green, 12 blue; 4 green, 8 red, 17 blue
Game 92: 13 red, 2 blue, 12 green; 19 green, 7 red; 17 green, 2 blue, 3 red; 6 blue, 11 red, 10 green; 6 red, 15 green, 3 blue; 6 blue, 20 green, 11 red
Game 93: 2 blue, 3 green; 1 blue, 4 red; 1 red
Game 94: 3 red, 5 green, 6 blue; 7 blue, 5 green, 6 red; 9 blue, 1 green, 2 red; 4 blue, 1 green, 4 red
Game 95: 8 green, 9 red, 2 blue; 7 green, 7 red; 2 green, 4 blue, 6 red; 6 blue, 2 red, 2 green
Game 96: 11 blue, 4 red; 1 green, 3 red, 14 blue; 2 green, 3 red, 8 blue; 7 red, 1 green, 3 blue; 8 blue, 6 red, 2 green; 9 blue, 3 red, 3 green
Game 97: 5 green, 13 red, 7 blue; 2 blue, 12 red, 6 green; 10 blue, 11 red, 3 green; 4 green, 11 blue, 15 red; 8 green, 16 blue, 1 red; 15 blue, 4 red, 5 green
Game 98: 3 blue, 1 red; 4 blue; 2 green, 1 blue; 2 green, 1 red, 5 blue
Game 99: 4 green, 3 blue, 9 red; 6 blue, 5 red, 3 green; 2 green, 4 blue, 7 red; 8 red, 4 blue; 2 green, 15 red; 4 red, 5 blue, 3 green
Game 100: 8 red, 4 blue, 4 green; 10 blue, 3 red, 4 green; 10 green, 4 red; 18 red, 9 blue, 2 green; 12 red, 4 green, 2 blue`,
    { red: 12, green: 13, blue: 14 }
  )
)
