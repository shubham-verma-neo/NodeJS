const fs = require('fs');
const path = require('path');

const products = [];

let p;
switch (process.env.views) {
    case 'hbs':
        p = path.join(path.dirname(require.main.filename), 'data', 'hbs_products.json');
        break;
    case 'ejs':
        p = path.join(path.dirname(require.main.filename), 'data', 'ejs_products.json');
        break;
}

const getHelperFunction = (cb) => {
    fs.readFile(p, async (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    })
}


module.exports = class Product {
    constructor(obj) {
        switch (process.env.views) {
            case 'hbs':
                this.title = obj.title;
            case 'ejs':
                this.title = obj.title;
                this.imageurl = obj.imageurl;
                this.price = obj.price;
                this.description = obj.description;
        }
    }

    save() {
        switch (process.env.views) {
            case 'html':
            case 'pug':
                products.push(this);
                break;
            case 'hbs':
                getHelperFunction(products => {
                    products.push(this);
                    fs.writeFile(p, JSON.stringify(products), (err) => {
                        console.log("hbs_err: ", err);
                    });
                });
                break;
            case 'ejs':
                getHelperFunction(products => {
                    products.push(this);
                    fs.writeFile(p, JSON.stringify(products), (err) => {
                        console.log("ejs_err: ", err);
                    });
                });
                break;
        }

    }

    static fetchAll(cb) {
        switch (process.env.views) {
            case 'html':
            case 'pug':
                return products;
            case 'hbs':
                getHelperFunction(cb);
                break;
            case 'ejs':
                getHelperFunction(cb);
                break;
        }
    }
}