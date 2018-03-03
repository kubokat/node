const fs = require('fs');
const path = require('path');

const paths = process.argv.slice(2);

const inputFolder = paths[0];
const ountputFolder = paths[1];

function walk (inputFolder, callback) {
  fs.readdir(inputFolder, (err, files) => {
    if (err) {
      console.log('Ошибка чтения каталога');
    }

    files.forEach((item) => {
      let localBase = path.join(inputFolder, item);

      fs.stat(localBase, function (err, stats) {
        if (err) {
          console.log(err);
        }
        if (stats.isDirectory()) {
          walk(localBase, callback);
        } else {
          callback(localBase);
        }
      });
    });
  });
}

function changeFolder (path, callback) {
  fs.exists(path, (exists) => {
    if (exists) {
      callback();
    } else {
      fs.mkdir(path, function (err) {
        if (err) {
          console.log(err);
        }
        callback();
      });
    }
  });
}

walk(inputFolder, function (localPath) {
  let folderName = path.basename(localPath).substring(0, 1).toUpperCase();
  let distanationPath = path.join(ountputFolder, folderName);

  changeFolder(distanationPath, function () {
    let newPath = path.join(distanationPath, path.basename(localPath));

    let readStream = fs.createReadStream(localPath);
    let writeStream = fs.createWriteStream(newPath);

    readStream.on('close', function () {
      fs.unlink(localPath, function (err) {
        console.log(err);
        fs.rmdir(path.dirname(localPath), function (err) {
          console.log(err);
        });
      });
    });

    readStream.pipe(writeStream);
  });
});
