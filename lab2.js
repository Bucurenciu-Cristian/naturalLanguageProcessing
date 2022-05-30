const fs = require("fs");
const path = require("path");
const randomInterogation = require("./Interogare");
const IDF = require('./normalizari/IDF');
const natural = require("natural");
const stemmer = natural.LancasterStemmer;

const normalizareaNominala = (indexulCuvantului, documentul) => {
    return numarulDeAparitiiACuvântuluiXdinDocumentulY(indexulCuvantului, documentul) / cuvantulXCeApareCelMaiFrecventInDocument(documentul)
}
const normalizareLogaritmica = (cuvantul, documentul) => {
    const occurences = numarulDeAparitiiACuvântuluiXdinDocumentulY(cuvantul, documentul);
    let temp;
    if (occurences === 0) {
        temp = 0;
    } else {
        temp = 1 + Math.log2(1 + Math.log2(occurences))
    }
    return temp;
}

const composeMatriceBinara = (matriceRara) => {
    const matriceTemp = [];
    for (const matriceRaraElement of matriceRara) {
        matriceRaraElement[1] = "1";
        matriceTemp.push(matriceRaraElement);
    }
    return matriceTemp;
}
const numarulDeAparitiiACuvântuluiXdinDocumentulY = (indexCuvant, document) => {
    const temp = document.filter(item => item[0] == indexCuvant)
    return temp[0][1];
}
const termFrequency = (documentul, matriceRaraIDF) => {
    let arrayTemp = [];
    let toateIndexurile = documentul.map(item => item[0]);
    for (const index of toateIndexurile) {
        arrayTemp.push(matriceRaraIDF[index])
    }
    return arrayTemp;
}

const makeVectorCountsAttributes = (matriceAtribute, matriceRaraNenormalizata) => {
    let lungimeaMatriciiDeAtribute = matriceAtribute.length;
    let matriceTemporara = new Array(lungimeaMatriciiDeAtribute).fill(0);
    const matriceTemporaraIndexi = []
    // console.log({matriceRaraNenormalizata})
    for (let [index, element] of matriceRaraNenormalizata.entries()) {
        let indexii = element.map(x => x[0]);
        
        matriceTemporaraIndexi.push(indexii);
    }
    for (let item of matriceTemporaraIndexi) {
        for (const itemElement of item) {
            matriceTemporara[itemElement] = matriceTemporara[itemElement] + 1;
        }
    }
    return matriceTemporara;
}
const cuvantulXCeApareCelMaiFrecventInDocument = (document) => {
    const temp = document.map(item => item[1])
    return Math.max(...temp);
}
const wholeFile = fs.readFileSync(
    path.join(__dirname, "reuters34.txt"),
    "utf8"
);
const dataString = "@data";
const attributeString = "@attribute";
const dataAtribute = {
    index: wholeFile.indexOf(dataString) + dataString.length,
};
const fromDataBelow = wholeFile.slice(dataAtribute.index);
const fromDataUpward = wholeFile.slice(0, dataAtribute.index - dataString.length);
let matriceaCuAtribute = fromDataUpward.split("\r\n");
matriceaCuAtribute = matriceaCuAtribute.map((item) =>
    item.slice(attributeString.length + 1)
);
let matricePeLinie = fromDataBelow.split("\r\n").slice(1);
let matriceMare = [];
for (const linie of matricePeLinie) {
    let [numeleFisierului, matriceaNula, trasaturiile] = linie.split("#");
    if (matriceaNula !== undefined) {
        matriceaNula = matriceaNula.trim();
        matriceaNula = matriceaNula.split(" ");
        matriceaNula = matriceaNula.map((x) => x.split(":"));
    }
    if (trasaturiile !== undefined) {
        trasaturiile = trasaturiile.trim();
    }
    matriceMare.push([numeleFisierului.trim(), matriceaNula, trasaturiile]);
}
/**
 * Functii Similaritatea Cosinus
 */

const numaratorCosinus = (interogareIndexes, matriceInterogareAtributeIDF, entryIndexes, matriceAtributeIDF) => {
    let suma = 0;
    for (let index of interogareIndexes) {
        let valoareInterogare = matriceInterogareAtributeIDF[index]
        let valoareEntry = matriceAtributeIDF[index]
        let valoareIntermediara = valoareInterogare * valoareEntry;
        suma += valoareIntermediara;
    }
    return [suma];
}
const numitorCosinus = (interogareIndexes, matriceInterogareAtributeIDF, entryIndexes, matriceAtributeIDF) => {
    let sumaInterogare = 0;
    for (const interogareIndex of interogareIndexes) {
        let valoareInterogare = matriceInterogareAtributeIDF[interogareIndex]
        valoareInterogare = valoareInterogare * valoareInterogare
        sumaInterogare += valoareInterogare;
    }
    let radicalInterogare = Math.sqrt(sumaInterogare);
    
    
    let sumaEntry = 0;
    for (const index of entryIndexes) {
        let valoareEntry = matriceAtributeIDF[index];
        valoareEntry = valoareEntry * valoareEntry;
        sumaEntry += valoareEntry;
    }
    
    let radicalEntry = Math.sqrt(sumaEntry);
    return radicalInterogare * radicalEntry;
};

const similaritateaCosinusuluiDintreInterogareSiEntry = (interogareIndexes, matriceInterogareAtributeIDF, entryIndexes, matriceAtributeIDF, count) => {
    let rezultatNumarator = numaratorCosinus(interogareIndexes, matriceInterogareAtributeIDF, entryIndexes, matriceAtributeIDF);
    let rezultatNumitor = numitorCosinus(interogareIndexes, matriceInterogareAtributeIDF, entryIndexes, matriceAtributeIDF);
    return [count, rezultatNumarator / rezultatNumitor];
}

/**
 * Final Similaritatea Cosinus
 */

/**
 * De aici intram in faza de interogare.
 * @param matriceAtribute
 * @param matriceInterogare
 * @returns {[any[],any[]]}
 */
const matriceInterogareAtributeFunctie = (matriceAtribute, matriceInterogare) => {
    let lungimeaMatriciiDeAtribute = matriceAtribute.length;
    let filtreazaMatriceAtribute = []
    let matriceTemporaraAtribute = new Array(lungimeaMatriciiDeAtribute).fill(0);
    for (const value of matriceInterogare) {
        if (matriceAtribute.includes(value)) {
            const indexMatriceAtribute = matriceAtribute.indexOf(value);
            matriceTemporaraAtribute[indexMatriceAtribute] = matriceTemporaraAtribute[indexMatriceAtribute] + 1;
            filtreazaMatriceAtribute.push([indexMatriceAtribute.toString(), matriceTemporaraAtribute[indexMatriceAtribute].toString()]);
        }
    }
    let matriceDemo = []
    for (const [index, value] of matriceTemporaraAtribute.entries()) {
        if (value !== 0) {
            matriceDemo.push([index.toString(), value.toString()]);
        }
    }
    return [filtreazaMatriceAtribute, matriceTemporaraAtribute]
}
const isNotInteger = str => {
    if (typeof str !== 'string') return true;
    const num = Number(str);
    let esteNumar = Number.isInteger(num);
    if (esteNumar) {
        const lungime = str.split("");
        if (lungime.length > 3 && esteNumar) return true
    }
    let nuEsteNumar = !esteNumar;
    return nuEsteNumar;
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
const arrayWithArtefacts = ['$', "(", ")", "\\n", "quot"]
let interogareAleatorie = randomInterogation
interogareAleatorie = stemmer.tokenizeAndStem(interogareAleatorie);
interogareAleatorie = interogareAleatorie.filter(item => isNotInteger(item));
interogareAleatorie = removeCharacters(interogareAleatorie, arrayWithArtefacts)
console.log(interogareAleatorie)
let [matriceInterogareRara, matriceInterogareAtributeIDF] = matriceInterogareAtributeFunctie(matriceaCuAtribute, interogareAleatorie)
/**
 * Aici se termina faza de interogare.
 */
let matriceNumeFisiere = [];
let matriceaRaraSimpla = [];
let matriceaRaraBinara = [];
let matriceImensaIDF = [];
let matriceTrasaturi = [];
let matriceAtributeIDF = [];
let matriceRaraInterogareIDF = [];
let matriceRaraInterogareIDFFinalIndexes = [];
let matriceRaraInterogareIDFFinalValues = [];
for (const item of matriceMare) {
    matriceNumeFisiere.push(item[0]);
    matriceaRaraSimpla.push(item[1]);
    matriceTrasaturi.push(item[2]);
}
matriceNumeFisiere = matriceNumeFisiere.filter(item => item)
matriceaRaraSimpla = matriceaRaraSimpla.filter(item => item)
matriceTrasaturi = matriceTrasaturi.filter(item => item)
const totalDocumente = matriceNumeFisiere.length;
const matriceaCuAtributeCounts = makeVectorCountsAttributes(matriceaCuAtribute, matriceaRaraSimpla);

for (const [index, item] of matriceaCuAtributeCounts.entries()) {
    matriceAtributeIDF.push(IDF(index, totalDocumente, item));
}
for (const [index, item] of matriceInterogareAtributeIDF.entries()) {
    matriceRaraInterogareIDF.push(IDF(index, totalDocumente, item));
}
for (let [index, value] of matriceRaraInterogareIDF.entries()) {
    if (!isNaN(value)) {
        matriceRaraInterogareIDFFinalIndexes.push(index);
        matriceRaraInterogareIDFFinalValues.push(value);
        matriceInterogareAtributeIDF[index] = value;
    } else {
        matriceInterogareAtributeIDF[index] = 0;
    }
}
let matriceImensaIndexi = [];
for (const [index, document] of matriceaRaraSimpla.entries()) {
    const indexi = document.map(atribut => atribut[0]);
    matriceImensaIndexi.push(indexi);
    /**
     * MatriceaBinara.
     * Cu probleme, modifica array-ul original, dar nu vreau asta.
     */
    matriceaRaraBinara.push(composeMatriceBinara(document));
    matriceImensaIDF.push(termFrequency(document, matriceAtributeIDF))
}
let matriceRezultate = []
for (const [index, element] of matriceImensaIndexi.entries()) {
    let rezultatInterogareSiEntry =
        similaritateaCosinusuluiDintreInterogareSiEntry(
            matriceRaraInterogareIDFFinalIndexes,
            matriceInterogareAtributeIDF,
            element,
            matriceAtributeIDF,
            index
        );
    console.info({rezultatInterogareSiEntry})
    matriceRezultate.push(
        rezultatInterogareSiEntry
    );
}
// console.log({matriceRezultate})
let incercareSortare = matriceRezultate.sort((a, b) => {
    return a[1] - b[1];
});
let matriceRezultateValoriSortatDescrescator = incercareSortare.reverse();
let matriceRezultateValoriSortatDescrescatorTop10 = matriceRezultateValoriSortatDescrescator.slice(1, 10);
for (const [index, valoare] of matriceRezultateValoriSortatDescrescatorTop10) {
    console.log(index);
    console.log(matriceNumeFisiere[index]);
}

similaritateaCosinusuluiDintreInterogareSiEntry( matriceRaraInterogareIDFFinalIndexes,
    matriceInterogareAtributeIDF,
    matriceImensaIndexi[11],
    matriceAtributeIDF,
    11)
