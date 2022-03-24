//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory
const paths = {
    reuters: path.join(__dirname, 'reuters'),
    stopWords: path.join(__dirname, 'stopwords'),
    encoding: 'utf8'
}
//passsing directoryPath and callback function
const removeDotFromLastItemInArray = (vector) => {
    const lastString = vector[vector.length - 1].replace(".", "")
    vector[vector.length - 1] = lastString;
    return vector;
}
const findTheWordsWithTheDots = (vector) => {
    const tempVect = []
    vector.map(item => {
            if (item.endsWith(".")) {
                tempVect.push(item)
            }
        }
    )
    return tempVect;
}
const removeTheSymbolFromArray = (vector, simbol) => {
    
};
const findAndTrimTheText = (bigString, startTag, endTag, split = " ") => {
    const startTagLength = startTag.length;
    const beginIndex = bigString.search(startTag)
    const endIndex = bigString.search(endTag)
    return bigString
        .slice(beginIndex + startTagLength, endIndex)
        .trim()
        .split(split)
}

const globalVector = [];

fs.readdir(paths.stopWords, (err, files) => {
//handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    for (const file of files) {
        // console.log(file);
        const plainTextLong = fs.readFileSync(paths.stopWords + "/" + file, paths.encoding)
    }
});
fs.readdir(paths.reuters, callbackFunctionReuters);

function callbackFunctionReuters(err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    for (const file of files) {
        const plainTextLong = fs.readFileSync(paths.reuters + "/" + file, paths.encoding)
        const titluArray = removeDotFromLastItemInArray(findAndTrimTheText(plainTextLong, "<title>", "</title>"))
        const abrevieriTitle = findTheWordsWithTheDots(titluArray);
        const textArray = findAndTrimTheText(plainTextLong, "<text>", "</text>", "\n")
            .map(line => line.slice(3, line.length - 4).split(" "))
            .map((array) => removeDotFromLastItemInArray(array))
            
        const abrevieriText = textArray.flatMap(tablou => {
            return findTheWordsWithTheDots(tablou)
        });
        console.log(abrevieriText)
        // console.log(interiorText, "\n", file, "\n", titleLastString, "\n", abrevieriTitle)
        // const flatInteriorText = interiorText.flat();
        {
            let topicsStringSearch = '<codes class="bip:topics:1.0">';
            const topicsIndex = plainTextLong.search(topicsStringSearch);
            const topicsSfarsit = plainTextLong.lastIndexOf("</codes>")
            let codeString = "code=";
            const ArrayTopicsCodes = plainTextLong
                .slice(topicsIndex + topicsStringSearch.length, topicsSfarsit)
                .trim()
                .split('\n')
                .filter(item => {
                    if (item.includes(codeString)) {
                        return true;
                    }
                })
                .map(x => x
                    .slice(
                        x.search(codeString) + codeString.length + 1,
                        x.length - 3
                    )
                )
            // console.log(ArrayTopicsCodes)
        }
        {
            const sourceStr = 'I learned to play the Ukulele in Lebanon.';
            const searchStr = 'le';
            //One liner
            const removeDuplicates = (arr) => [...new Set(arr)];
            const indexes = [...sourceStr.matchAll(new RegExp(searchStr, 'gi'))].map(a => a.index);
            // console.log(indexes); // [2, 25, 27, 33]
        }
    }
};

