const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

module.exports.getAdmin = async function (ctx, next) {
   console.log(ctx.session.isAdmin);
    if (ctx.session.isAdmin) {
        await ctx.render('pages/admin', { title: 'Main' });
    } else {
        await ctx.redirect('/login');
    }
};

module.exports.setCounter = async function (ctx, next) {

    const adapter = new FileAsync('models/db.json');

    await low(adapter)
        .then(db => {
            if (db.get('skills').find().value()) {
                db.get('skills').remove().write();
            }
            return db;
        }).then(db => {
            const skillsObj = [
                { number : ctx.request.body.age, text: 'Возраст начала занятий на скрипке' },
                { number : ctx.request.body.concerts, text: 'Концертов отыграл' },
                { number : ctx.request.body.cities, text: 'Максимальное число городов в туре' },
                { number : ctx.request.body.years, text: 'Лет на сцене в качестве скрипача' },
            ]

            return db.get('skills').push(skillsObj).write()
        }).then(new_skill => {
            ctx.body = new_skill;
        });
};

module.exports.uploadFile = async function (ctx, next) {

    let form = new formidable.IncomingForm();
    let upload = path.join('./public', 'upload');
    const adapter = new FileSync('models/db.json')
    const db = low(adapter)
    let fileName;
  
    if (!fs.existsSync(upload)) {
      await fs.mkdirSync(upload);
    }
  
    form.uploadDir = path.join(process.cwd(), upload);
  
    await form.parse(ctx.req, function (err, fields, files) {
        fileName = path.join(upload, files.photo.name);

        fs.rename(files.photo.path, fileName, async function (err) {
            if (err) {
              console.error(err);
              await fs.unlink(fileName);
              await fs.rename(files.photo.path, fileName);
            }
    
            await db.get('files')
                .push({ dir: '/upload/' + path.basename(fileName), name: fields.name, price: fields.price })
                .write();
    
        });

    });

    await ctx.redirect('/admin');
  

};
