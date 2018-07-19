const express = require('express');
const formidable = require('express-formidable');
const fs = require('fs');
const util = require('./util');
const path = require('path');
const app = express();
const jsonDir = './jsons';
const upDir = './upload';
const sep = '#:|:#'

if (!fs.existsSync(jsonDir)) {
    util.print.red(jsonDir + ' is not exist! start to mkdir' + jsonDir);
    fs.mkdirSync(jsonDir);
    util.print.red(jsonDir + ' created!');
}
if (!fs.existsSync(upDir)) {
    util.print.red(upDir + ' is not exist! start to mkdir' + upDir);
    fs.mkdirSync(upDir);
    util.print.red(upDir + ' created!');
}
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.set('view cache', false);

app.use(formidable({
    encoding: 'utf-8',
    uploadDir: path.resolve(__dirname, upDir),
    keepExtensions: true, //保留后缀
    multiples: true, //将req.files保存为数组

}));
app.use((req, res, next) => {
    util.print.green(req.method + ' : ' + req.originalUrl);
    return next();
})
app.get('/', (req, res, next) => {
    const files = fs.readdirSync(jsonDir);
    const descs = [];
    files.forEach(item => {
        const data = fs.readFileSync(jsonDir + '/' + item, 'utf-8');
        descs.push(data.split(sep)[0]);
    });
    return res.render('index', {
        files,
        descs
    });
});

app.use('/api', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    if (!req.query.method) {
        return next();
    }
    try {
        switch (req.query.method) {
            case 'getData':
                const data = fs.readFileSync(jsonDir + '/' + req.query.data + '.txt', 'utf-8');
                return res.send(data.split(sep)[1]);
            default:
                return next();
        }
    } catch (e) {
        return next();
    }
});

app.post('/api', (req, res, next) => {
    if (!req.fields.method) {
        return next();
    }
    try {
        switch (req.fields.method) {
            case 'addData':
                const fileName = Date.now() + '.txt';
                fs.writeFileSync(jsonDir + '/' + fileName, req.fields.desc + sep + req.fields.data, 'utf-8');
                return res.redirect('back');

            case 'deleteData':
                fs.unlinkSync(jsonDir + '/' + req.fields.name);
                return res.redirect('back');
            default:
                return next();
        }
    } catch (e) {
        util.print.red('bad post:' + req.originalUrl);
        return res.redirect('back');
    }
});

app.get((req, res, next) => {
    util.print.red('bad request::' + req.method + req.originalUrl);
    return res.send('bad path');
});

app.listen(2048, () => {
    util.print.yellow('server is runing at:2048');
});