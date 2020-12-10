/**
 * getRandomSearch
 * @param null Generates random search string
 * @returns String consiting of a valid character with a leading and or following '%'
 */
function getRandomSearch() {
    // A list of all characters that can be chosen.
    const characters = 'abcdefghijklmnopqrstuvwxyz~`!@#$%^&()<>-_=1234567890.,\'\";:?/\\{}[]| ';
    
    // Gets a random character from the characters string.
    let randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    if (randomCharacter.charAt(0) == '+' || randomCharacter.charAt(0) == '-'){
      randomCharacter = `\\${randomCharacter}`;
    }
    return randomCharacter;
  }

  module.exports = {
    getRandomSearch: getRandomSearch
};