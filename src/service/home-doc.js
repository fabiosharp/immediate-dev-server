'use strict';
const dbLoader = require('../service/db-loader')
const params = require('../config/params')
const fs = require('fs')

const templateHome = process.cwd() + params.templateHome

module.exports = function(app){

    app.get('/', function(req, res, next){
        
        fs.readFile(templateHome, 'utf-8' ,(err, data) => {
            if (err) 
                throw err;
            res.send( templateFormatter(data))
            
          });
    });
}

function templateFormatter(data){
    const dbs = dbLoader.getAllDbs();

    let final = '';
    dbs.forEach(db=>{
        let simpleget = `
        <h3>${db.name}</h3>
        <div class="method get" data-id="${db.name}" data-method='GET'>
            <div class="call">
                <label >URL [GET]</label>
                <input type="text" value="/${db.name}">
                <button>Go!</button>
            </div>
            <div class="response">Saída</div>
        </div>        
        `
        let getcount =`
        <div class="method get count" data-id="${db.name}" data-method='GET'>
            <div class="call">
                <label >URL [GET]</label>
                <input type="text" value="/${db.name}/count">
                <button>Go!</button>
            </div>
            <div class="response">Saída</div>
        </div>        
        `
        let post = `
        <div class="method post" data-id="${db.name}" data-method='POST'>
            <div class="call">
                <label >URL [POST]</label>
                <input type="text" value="/${db.name}">
                <button>Go!</button>
                <label >Documento (json para envio)</label>
                <textarea name="post-${db.name}" id="" cols="30" rows="5"></textarea>
            </div>
            <div class="response">Saída</div>
        </div>
        `
        let put = `
        <div class="method put" data-id="${db.name}" data-method='PUT'>
            <div class="call">
                <label >URL [PUT]</label>
                <input type="text" value="/${db.name}/{_id}">
                <button>Go!</button>
                <label >Documento (json para envio)</label>
                <textarea name="post-${db.name}" id="" cols="30" rows="5"></textarea>
            </div>
            <div class="response">Saída</div>
        </div>
        `
        let del = `
        <div class="method delete" data-id="${db.name}" data-method='DELETE'>
            <div class="call">
                <label for="get-${db.name}">URL [DELETE]</label>
                <input type="text" value="/${db.name}/{_id}">
                <button>Go!</button>
            </div>
            <div class="response">Saída</div>
        </div>`
        final += simpleget + getcount + post + put + del
    });

    return data.replace('{{routes}}', final)

}