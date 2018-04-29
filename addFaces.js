const fr = require('face-recognition');
const path = require('path');
const fs = require('fs');
const recognizer = fr.AsyncFaceRecognizer();

const dataPath = path.resolve('./robert');
const allFiles = fs.readdirSync(dataPath)
                .map(f => path.join(dataPath, f));
const allImgs = allFiles.map(image => fr.loadImage(image));
// recognizer.addFaces(allImgs, 'robert')
// .then(() => {
//     const modelState = recognizer.serialize();
//     fs.writeFileSync('robert-model.json', JSON.stringify(modelState))
// });


const modelState = require('./robert-model.json')
recognizer.load(modelState)
const faceImg = fr.loadImage('./obama.jpg');
recognizer.predictBest(faceImg)
.then((prediction) => {
    console.log(prediction.className, prediction.distance)
}).catch((err) => {
    console.log('predictBest: ', err);
});

