const IDF = (indexCuvant, numarDocumente, contineCuvant) => {
    let number
    if (contineCuvant != 0) {
        number = Math.log2(numarDocumente / contineCuvant);
    } else {
        number = NaN;
    }
    return number;
}
module.exports = IDF
