const nodemailer = require('nodemailer');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

module.exports.getIndex = async function (ctx, next) {

    const adapter = new FileAsync('models/db.json');

    let skills = {};
    let products = {};

    await low(adapter)
    .then(db => {
        skills = db.get('skills').find().value();
        return db;
    })
    .then(db => {
        products = db.get('files').value();
        return db;
    })
    .then(async db => {
        await ctx.render('pages/index', { title: 'Main', skills: skills, products: products });
    });
  
};

module.exports.sendMail = async function (ctx, next) {
    const transporter = await nodemailer.createTransport(ctx.config.mailer);

    let message = '';
    let infoMessage;

    message +='<p>' + ctx.request.body.name + '<p>';
    message +='<p>' + ctx.request.body.email + '<p>';
    message +='<p>' + ctx.request.body.message + '<p>';

    await transporter.sendMail({
        from: ctx.config.mailer.auth.user,
        to: ctx.config.mailer.auth.user,
        subject: 'theme',
        html: message
    }).then((completed) => {
        ctx.body = completed;
    });
};