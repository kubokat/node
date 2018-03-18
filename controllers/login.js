const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const crypto = require('crypto');

module.exports.getLogin = function (req, res) {
    res.render('pages/login', { title: 'Main' });
};

module.exports.checkUser = function (req, res) {

    try {
        if(req.body.email === undefined) {
            throw 'email is empty'; 
        }

        if(req.body.password === undefined) {
            throw 'password is empty'; 
        }
    }
    catch(e) {
        res.render('error', { error: error });
    }

    const adapter = new FileAsync('models/db.json');

    low(adapter)
        .then(db => {
            return db.get('users').find({ email: req.body.email, pass: crypto.createHash('md5').update(req.body.password).digest("hex") }).value();
        }).then(user => {
            if (user === undefined) {
                req.session.isAdmin = false;
                res.redirect('/login');
            } else {
                req.session.isAdmin = true;
                res.redirect('/admin'); 
            }
        });

};