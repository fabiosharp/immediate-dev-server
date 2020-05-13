'use strict';
const dbLoader = require('../service/db-loader')
const params = require('../config/params')
const fs = require('fs')

const templateHome = process.cwd() + params.templateHome

module.exports = function(app){

    const dbs = dbLoader.getAllDbs();

    app.get('/', function(req, res, next){
        console.log('arquivo', templateHome)
        fs.readFile(templateHome, 'utf-8' ,(err, data) => {
            if (err) 
                throw err;
            res.send(data)
            
          });
    });
}
