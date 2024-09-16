const fs = require('fs');
const process = require('process');
const axios = require('axios');

function handleWrite(text, outFile) {
    if (outFile) {
        fs.writeFile(outFile, text, 'utf8', function (err) {
            if (err) {
                console.error(`Couldn't write ${outFile}:\n ${err}`);
                process.exit(1);
            }
        });
    } else {
        console.log(text);
    }
}

function cat(path, outFile) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            console.error(`Error reading ${path}:\n ${err}`);
            process.exit(1);
        } else {
            handleWrite(data, outFile);
        }
    });
}

async function webCat(url, outFile) {
    try {
        // await axios.get(url).then(function (res) {
        //     console.log(res.data);
        // });
        let res = await axios.get(url);
        handleWrite(res.data, outFile);
    } catch (err) {
        console.error(`Error fetching ${url}:\n ${err}`);
        process.exit(1);
    }
}

let path;
let outFile;

if (process.argv[2] === '--out') {
    outFile = process.argv[3];
    path = process.argv[4];
} else {
    path = process.argv[2];
}

if (path.slice(0, 4) === 'http') {
    webCat(path, outFile);
} else {
    cat(path, outFile);
}