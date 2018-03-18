const config = require('../config');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const nodemailer = require('nodemailer');

module.exports.getIndex = function (req, res) {

    const adapter = new FileAsync('models/db.json');

    let skills = {};
    let products = {};

    low(adapter)
        .then(db => {
            skills = db.get('skills').find().value();
            return db;
        })
        .then(db => {
            products = db.get('files').value();
            return db;
        })
        .then(db => {
            console.log(products);
            res.render('pages/index', { title: 'Main', skills: skills, products: products });
        });
};

module.exports.sendMail = function (req, res) {
    const transporter = nodemailer.createTransport(config.mailer);

    let message = '';

    message +='<p>' + req.body.name + '<p>';
    message +='<p>' + req.body.email + '<p>';
    message +='<p>' + req.body.message + '<p>';

    transporter.sendMail({
        from: config.mailer.auth.user,
        to: config.mailer.auth.user,
        subject: 'theme',
        html: message
    }, function (error, info) {

        try {
            if(error) {
                throw error 
            }
        }
        catch(e) {
            res.render('error', { error: error });
        }

        res.json({message: info});
    });
};