const async = require('async');
const fr = require('face-recognition');
const path = require('path');
const fs = require('fs');
const recognizer = fr.AsyncFaceRecognizer();
const detector = fr.AsyncFaceDetector();

const modelState = require('./robert-model.json')
recognizer.load(modelState);

function checkObamaFace(){
    const faceImg = fr.loadImage('./obama-face.png');
    recognizer.predictBest(faceImg)
    .then((prediction) => {
        console.log(prediction.className, prediction.distance)
    }).catch((err) => {
        console.log('predictBest: ', err);
    });
}
function addFaces(pathDir){
   return new Promise((resolve, reject) => {
        const dataPath = path.resolve(pathDir);
        const allFiles = fs.readdirSync(dataPath)
                        .map(f => path.join(dataPath, f));
        const allImgs = allFiles.map(image => fr.loadImage(image));
        let i = 0;
        const detectFace = (img, next) => {
            i++;
            detector.detectFaces(img)
            .then((faceImages) => {
                if(faceImages && faceImages[0]) {
                    fr.saveImage(pathDir + `-face/${i}.png`, faceImages[0]);
                    next();
                }
            })
            .catch((error) => {
                console.log(error);
                next();
            });
        }
        const endFaces = () => {
            console.log("Fin procesar imagenes de " + pathDir);
            resolve();
        }
        async.eachSeries(allImgs, detectFace, endFaces)
    });
}
function createModel(pathDir, classname) {
    addFaces(pathDir).then(() => {
        const dataPath = path.resolve(pathDir + '-face');
        const allFiles = fs.readdirSync(dataPath)
                        .map(f => path.join(dataPath, f));
        const allImgs = allFiles.map(image => fr.loadImage(image));
        recognizer.addFaces(allImgs, classname)
        .then(() => {
            const modelState = recognizer.serialize();
            fs.writeFileSync(classname + '-model.json', JSON.stringify(modelState))
        });

    });
}
// createModel('./robert', 'robert')
checkObamaFace();
