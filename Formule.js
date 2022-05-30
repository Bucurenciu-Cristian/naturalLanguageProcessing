const Log10 = Math.log10(10);
const log2 = Math.log2(2);
console.log(Log10)

// find logarithm in any base

const log = (base, number) => Math.log(number) / Math.log(base);

// calculating log(100) in base 10
var value = log(10, 100);
console.log(value); // 2

// calculating log(10) in base 5
value = log(5, 10);
console.log(value); // 1.4306765580733933
/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 */
const occurrences = (string, subString, allowOverlapping) => {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);
    let n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;
    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
};
console.log("Occurences",occurrences("mama","m"));
