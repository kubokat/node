const path = require('path');
const fs = require('fs');

const paths = process.argv.slice(2);

const inputFolder = paths[0];
const ountputFolder = paths[1];

let filePaths = [];

fs.readdirAsync = function (dir) {
  return new Promise(function (resolve, reject) {
    fs.readdir(dir, function (err, list) {
      if (err) {
        reject(err);
      } else {
        resolve(list);
      }
    });
  });
};

fs.statAsync = function (file) {
  return new Promise(function (resolve, reject) {
    fs.stat(file, function (err, stat) {
      if (err) {
        reject(err);
      } else {
        resolve(stat);
      }
    });
  });
};

fs.existsAsync = function (path) {
  return new Promise(function (resolve, reject) {
    fs.exists(path, (exists) => {
      if (!exists) {
        fs.mkdir(path, function (err) {
          if (err) {
            console.log(err);
          }

          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

function walk (dir) {
  return fs.readdirAsync(dir).then(function (list) {
    return Promise.all(list.map(function (file) {
      file = path.join(dir, file);
      return fs.statAsync(file).then(function (stat) {
        if (stat.isDirectory()) {
          return walk(file);
        } else {
          return file;
        }
      });
    }));
  }).then(function (results) {
    results.forEach(item => {
      filePaths.push(item);
    });
  });
}

walk(inputFolder).then(function (results) {
  filePaths = filePaths.filter(Boolean);
}).then(function () {
  filePaths.forEach((item) => {
    let folderName = path.basename(item).substring(0, 1).toUpperCase();
    let distanationPath = path.join(ountputFolder, folderName);
    let newPath = path.join(distanationPath, path.basename(item));

    fs.existsAsync(distanationPath).then(function () {
      let readStream = fs.createReadStream(item);
      let writeStream = fs.createWriteStream(newPath);
      readStream.on('close', function () {
        fs.unlink(item, function (err) {
          console.log(err);
          fs.rmdir(path.dirname(item), function (err) {
            console.log(err);
          });
        });
      });

      readStream.pipe(writeStream);
    });
  });
});
