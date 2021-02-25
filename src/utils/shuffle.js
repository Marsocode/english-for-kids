export default function shuffle(array) {
  const localArr = array;
  let currIndex = localArr.length;
  let randIndex;

  // While there are elements in the array
  while (currIndex !== 0) {
    // Pick a random index
    randIndex = Math.floor(Math.random() * currIndex);
    // Decrease counter by 1
    currIndex -= 1;
    // And swap the last element with it
    [localArr[currIndex], localArr[randIndex]] = [localArr[randIndex], localArr[currIndex]];
  }

  return localArr;
}
