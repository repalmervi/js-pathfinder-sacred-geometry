'use strict';

// see https://www.d20pfsrd.com/feats/general-feats/sacred-geometry/ for definition and rules

// This program will take in an arbitrarily long array of numbers and attempt to produce a prime constant based on the spell level provided by combining those numbers through addition, subtraction, multiplication, and division.

// The key is the effective spell level, which will return the prime constants
const primeConstantsPerSpellLevel = {
  1: [3, 5, 7],
  2: [11, 13, 17],
  3: [19, 23, 29],
  4: [31, 37, 41],
  5: [43, 47, 53],
  6: [59, 61, 67],
  7: [71, 73, 79],
  8: [83, 89, 97],
  9: [101, 103, 107],
};

// console.log(primeConstantsPerSpellLevel[1]);

// I need some code that will generate all the possible permutations of a set of numbers - what I'm finding in testing is that if I change the order of the inputs I get some of the answers, but not all of them, though taken together they form the whole set.

const permutator = function (inputArray) {
  let result = [];

  const permute = (array, currentValue = []) => {
    if (array.length === 0) {
      result.push(currentValue);
    } else {
      for (let i = 0; i < array.length; i++) {
        let current = array.slice();
        // console.log(current);
        let next = current.splice(i, 1);
        // console.log(next);
        permute(current.slice(), currentValue.concat(next));
      }
    }
  };

  permute(inputArray);

  return Array.from(new Set(result.map(JSON.stringify)), JSON.parse);
};

// console.log(permutator([1, 5, 5]));

const resultsOfTwoMemberOperations = function ([member1, member2]) {
  const validResults = new Set();

  // console.log(`Member 1: ${member1}; Member 2: ${member2}`);

  // addition and multiplication will always return a valid result
  validResults.add(member1 + member2);
  validResults.add(member1 * member2);

  // for subtraction, we need to try it both ways, but make sure the result is not negative before adding to validResults
  if (member1 - member2 >= 0) validResults.add(member1 - member2);
  if (member2 - member1 >= 0) validResults.add(member2 - member1);

  // for division, we need to try it both ways, but only add to validResults if the result is a whole number
  if (member1 % member2 === 0) validResults.add(member1 / member2);
  if (member2 % member1 === 0) validResults.add(member2 / member1);

  return Array.from(validResults);
};

const resultsOfThreeMemberOperations = function ([member1, member2, member3]) {
  const validResults = new Set();

  // first, generate all combinations of member1 and member2
  const validResultsOfMember1and2 = resultsOfTwoMemberOperations([
    member1,
    member2,
  ]);
  console.log(validResultsOfMember1and2);
  // then, generate all combinations of the combinations of the first 2 members and the 3rd member
  validResultsOfMember1and2.forEach(combination =>
    resultsOfTwoMemberOperations([combination, member3]).forEach(result =>
      validResults.add(result)
    )
  );

  return Array.from(validResults);
};

// return valid results for an arbitrary number of elements

const resultsOfNMemberOperations = function (members) {
  const results = members.reduce((accumulator, currentValue, index) => {
    // console.log(
    //   `Accumulator: ${accumulator}, Current Value: ${currentValue}, Index: ${index}`
    // );
    if (index > 1) {
      const resultForThisLoop = new Set();

      accumulator.forEach(combination =>
        resultsOfTwoMemberOperations([combination, currentValue]).forEach(
          result => resultForThisLoop.add(result)
        )
      );
      accumulator = Array.from(resultForThisLoop);
      // console.log(accumulator);
      return accumulator;
    } else {
      return accumulator;
    }
  }, resultsOfTwoMemberOperations([members[0], members[1]]));

  return results;
};

// diceRolls must always be positive (because you don't have a negative number on a die)

const sacredGeometryGenerator = function (spellLevel, ...diceRolls) {
  const primeConstantTargets = primeConstantsPerSpellLevel[spellLevel];

  console.log(
    `Spell Level is ${spellLevel}: Prime Constants: ${primeConstantTargets}`
  );
  // console.log(diceRolls);
  // diceRolls.forEach(die => console.log(die));

  // case 1: diceRolls.length === 2 (i.e., the caster has 2 ranks in Knowledge(Engineering). We don't start with length = 1 because the feat requires the caster to have at least 2 ranks in engineering)
  // console.log(diceRolls);
  // const results = permutator(diceRolls).forEach(permuation => );
  const permutations = permutator(diceRolls);
  let results = [];

  permutations.forEach(
    permutation =>
      (results = results.concat(resultsOfNMemberOperations(permutation)))
  );

  results = Array.from(new Set(results));

  console.log(
    `Input values: ${diceRolls}
Possible combinations: ${results.sort((a, b) => a - b)}`
  );
  if (results.some(die => primeConstantTargets.includes(die)))
    console.log(`Sacred Geometry success`);
  else {
    console.log(`Sacred Geometry failure`);
  }
};

sacredGeometryGenerator(1, 1, 2, 3);
sacredGeometryGenerator(1, 2, 3, 4);
sacredGeometryGenerator(1, 4, 5, 6);
sacredGeometryGenerator(1, 1, 5, 5);
sacredGeometryGenerator(1, 5, 5, 1);
sacredGeometryGenerator(9, 5, 1, 5);
