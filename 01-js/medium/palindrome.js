/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.
*/

function isPalindrome(str) {
  const newstr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = newstr.split('').reverse().join('');
  if(newstr !== reversed)
    return false;
  return true;
}

module.exports = isPalindrome;
