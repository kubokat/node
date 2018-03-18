const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const FileSync = require('lowdb/adapters/FileSync');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

module.exports.getAdmin = function (req, res) {

    if (req.session.isAdmin) {
        res.render('pages/admin', { title: 'Main' });
    } else {
        res.redirect('/login');
    }
};

module.exports.setCounter = function (req, res) {

    const adapter = new FileAsync('models/db.json');

    low(adapter)
        .then(db => {
            if (db.get('skills').find().value()) {
                db.get('skills').remove().write();
            }
            return db;
        }).then(db => {

            const skillsObj = [
                { number : req.body.age, text: 'Возраст начала занятий на скрипке' },
                { number : req.body.concerts, text: 'Концертов отыграл' },
                { number : req.body.cities, text: 'Максимальное число городов в туре' },
                { number : req.body.years, text: 'Лет на сцене в качестве скрипача' },
            ]

            return db.get('skills').push(skillsObj).write()
        }).then(new_skill => {
            return res.json({
                result: new_skill
              });
        });
};

module.exports.uploadFile = function (req, res) {

    let form = new formidable.IncomingForm();
    let upload = path.join('./public', 'upload');
    const adapter = new FileSync('models/db.json')
    const db = low(adapter)
    let fileName;
  
    if (!fs.existsSync(upload)) {
      fs.mkdirSync(upload);
    }
  
    form.uploadDir = path.join(process.cwd(), upload);
  
    form.parse(req, function (err, fields, files) {
      if (err) {
        return res.json({error: err});
      }
  
      if (files.photo.name === '' || files.photo.size === 0) {
        return res.json({error: 'картинка не загружена'});
      }
  
      if (!fields.name) {
        fs.unlink(files.photo.path);
        return res.json({error: 'Не указано описание'});
      }
  
      fileName = path.join(upload, files.photo.name);
  
      fs.rename(files.photo.path, fileName, function (err) {
        if (err) {
          console.error(err);
          fs.unlink(fileName);
          fs.rename(files.photo.path, fileName);
        }

        db.get('files')
            .push({ dir: '/upload/' + path.basename(fileName), name: fields.name, price: fields.price })
            .write();

        return res.json({result: 'Картинка успешно загружена'});
      });

    });
};