const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const crypto = require('crypto');

module.exports.getLogin =  async function (ctx, next) {
    await ctx.render('pages/login', { title: 'Main' });
};

module.exports.checkUser = async function (ctx, next) {

    try {
        if(ctx.request.body.email == '') {
            throw 'email is empty'; 
        }

        if(ctx.request.body.password == '') {
            throw 'password is empty'; 
        }
    }
    catch(e) {
        await ctx.render('error', { message: e });
    }

    const adapter = new FileAsync('models/db.json');

    await low(adapter)
        .then(db => {
            return db.get('users').find({ email: ctx.request.body.email, pass: crypto.createHash('md5').update(ctx.request.body.password).digest("hex") }).value();
        }).then(async user => {
            if (user === undefined) {
                ctx.session.isAdmin = false;
                ctx.redirect('/login');
            } else {
                ctx.session.isAdmin = true;
                ctx.redirect('/admin'); 
            }
        });

};