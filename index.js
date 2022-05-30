const path = require('path');
const fs = require('fs');
const natural = require('natural');
const paths = {
    reuters: path.join(__dirname, 'reuters'),
    stopWords: path.join(__dirname, 'stopwords'),
    encoding: 'utf8'
}
const randomInterogation = require("./Interogare");

let globalVector = [], localVector = [];
const vectorLocalMare = []

const stemmer = natural.LancasterStemmer;
const tokenizer = new natural.WordTokenizer();
const findAndTrimTheText = (bigString, startTag, endTag, split = " ") => {
    const startTagLength = startTag.length;
    const beginIndex = bigString.search(startTag)
    const endIndex = bigString.search(endTag)
    return bigString
        .slice(beginIndex + startTagLength, endIndex)
        .trim()
        .split(split)
}
const addToGlobalVector = (word) => {
    if (!globalVector.includes(word)) {
        globalVector.push(word)
    }
};
const removeCharacters = (tablou, artefacte) => {
    return tablou.map(item => {
        if (!artefacte.includes(item)) {
            return item
        } else {
            return undefined
        }
    });
}
const addToLocalVector = (word) => {
    const index = globalVector.indexOf(word)
    localVector[index] = (localVector[index] + 1) || 1;
}

const emit = (content = "Nu ai introdus nimic momentan, too bad", nameFile = "output", extFile = ".txt") => {
    fs.appendFileSync(nameFile + extFile, content.concat("\r\n"));
};
const arrayWithArtefacts = ['$', "(", ")", "\\n", "quot"]

const numeFisier = "reuters34";
const scrieVectorulGlobalInFisier = (tablou) => {
    tablou.map(word => emit(`@attribute ${word}`, numeFisier))
}
const scrieVectoriiLocaliInFisier = (tablou) => {
    emit("@data", numeFisier);
    tablou.forEach(item => {
        const appearance = item.vector
            .map((x, i) => {
                return (`${i}:${x} `)
            }).join("");
        
        const nameFile = item.fisier.split(".")[0];
        const topics = item.topicsCodes.join(" ");
        emit(`${nameFile} # ${appearance}# ${topics}`, numeFisier)
    });
}
const citesteDinFisiere = () => {
    const directoriesReuters = fs.readdirSync(paths.reuters);
    fs.writeFileSync(`${numeFisier}.txt`, '')
    
    directoriesReuters.map(fisier => {
        localVector = [];
        switch (path.extname(fisier)) {
            case ".XML":
                let fullPathOfCurrentFile = paths.reuters + "/" + fisier;
                const plainTextLong = fs.readFileSync(fullPathOfCurrentFile, paths.encoding)
                let titleText = findAndTrimTheText(plainTextLong, "<title>", "</title>")
                let paragraphText = findAndTrimTheText(plainTextLong, "<text>", "</text>", "\n")
                    .map(line => line.slice(3, line.length - 4).split(" "))
                paragraphText.unshift(...titleText)
                paragraphText = paragraphText.join("\n")
                
                
                // paragraphText = tokenizer.tokenize(paragraphText)
                paragraphText = stemmer.tokenizeAndStem(paragraphText);
                paragraphText = paragraphText.filter(item => isNotInteger(item));
                paragraphText = removeCharacters(paragraphText, arrayWithArtefacts)
                
                for (let word of paragraphText) {
                    addToGlobalVector(word)
                    addToLocalVector(word)
                }
                
                globalVector = globalVector
                    .filter(word => word !== undefined)
                    .filter(word => word.length > 2)
                let ArrayTopicsCodes = [];
            {
                let topicsStringSearch = '<codes class="bip:topics:1.0">';
                const topicsIndex = plainTextLong.search(topicsStringSearch);
                const topicsSfarsit = plainTextLong.lastIndexOf("</codes>")
                let codeString = "code=";
                ArrayTopicsCodes = plainTextLong
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
            }
                vectorLocalMare.push({
                    vector: localVector,
                    lungimea: localVector.length,
                    fisier,
                    "topicsCodes": ArrayTopicsCodes
                })
                break;
            case ".txt":
                break;
            default:
                console.log(`This is a stupid extension of ${path.extname(fisier)} in this file: ${fisier}`)
                break;
            
        }
    });
}


function isNotInteger(str) {
    if (typeof str !== 'string') return true;
    const num = Number(str);
    let esteNumar = Number.isInteger(num);
    if (esteNumar) {
        const lungime = str.split("");
        if (lungime.length > 3 && esteNumar) return true
    }
    let nuEsteNumar = !esteNumar;
    return nuEsteNumar;
}

//MAIN
citesteDinFisiere();
console.log("S-a terminat citirea din fisier");

scrieVectorulGlobalInFisier(globalVector);
console.log("Vectorul Global e gata");

scrieVectoriiLocaliInFisier(vectorLocalMare);
console.log("Programul s-a finalizat");
