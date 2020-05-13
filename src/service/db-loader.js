'use strict';

const dataStore = require('nedb')
const fs = require('fs')
const params = require('../config/params')

const folder = process.cwd() + '/' + params.databaseFolder
const defaultExtension = params.databaseExtension

/**
 * Returns an array of neDB Databases folder basead on databases/
 * 
 * @return {Array} an array of possible neDB Databases with this single format
 *                  { name: "database name", file: "file name"}
 */
module.exports.getAllDbs = function() {

    const files = fs.readdirSync(folder)
    const dbs = Array()

    files.forEach((file, index) => {
        if (file.endsWith(defaultExtension))
            dbs.push({name: file.replace(defaultExtension, ''), file})
    })

    return dbs
}

/**
 * Get a specific database by name
 * @param {String} dbName the database required
 * 
 * @returns {Object} a neDb database loaded
 */
module.exports.getDb = function(dbName){

    let db = new dataStore(folder + dbName + defaultExtension);
    return new Promise( (resolve, reject) => {
        db.loadDatabase(err=>{
            if (err)
                reject(err)
            else
                resolve(db)
        })
    })

}