/////////////////////////////////////
////////// ANKI - JAVASCRIPT ////////
/////////////////////////////////////

console.log('--------ANKI-----------')

import { input } from './input'

/*
 take in a string of lines (separated by \n)
 each line has at least one number in it
 transform each line into a 2-digit number consisting of the first number in the line and th second number in the line
 add all these numbers together, and return the result

 intuition:
 split string by newline, reduce the resultant array. start acc at 0
 curr is the current line. iterate through chars- if char is a number, store in an array
 when done, concatenate number in arr[0] to arr[arr.length - 1]
 return acc + concatenated num

*/

export const calibrate = (str: string): number => {
  const letters: Record<string, string> = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
  }

  return str.split('\n').reduce((acc: number, curr: string, i) => {
    //// Init array to store all the numbers we find
    const nums: string[] = []

    //// Split the current line and check each char.
    curr.split('').forEach((char: string, i, arr) => {
      //// If char is a num, add it to nums array
      if (Number.isInteger(+char)) nums.push(char)
      //// If char is not a num, start building a word to see if it's a number-word. If so, add it's corresponding value to our nums array.
      else {
        let word = char
        for (let j = i + 1; j < arr.length; j++) {
          if (Number.isInteger(+arr[j])) break
          word += arr[j]
          if (letters[word]) nums.push(letters[word])
        }
      }
    })

    //// Build our 2-digit number by concatening the first and last chars in nums
    const num: string = nums[0] + nums[nums.length - 1]

    //// Add the numberized version of our num string to the accumulator
    return acc + +num
  }, 0)
}

console.log(
  calibrate(`1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`),
  '142'
)

console.log(
  calibrate(`one
7threetwo
eightoneseven`),
  '170'
)

console.log(calibrate(input))

console.log('--------END ANKI-----------')

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////

//////////////////////////////////
//////////// LEETCODE ////////////
//////////////////////////////////

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////

////////////////////////////////////////////////////////////////////////
