'use strict';

const dbLoader = require('../service/db-loader')

/**
 * Cria as rotas default (GET, PUT, POST, DELETE) para cada NeDB criado
 * 
 * @param {Application} app é o Express Application utilizado no server
 */
function routers(app) {
    const dbs = dbLoader.getAllDbs();

    dbs.forEach(database => {
        console.log('rota', `/${database.name}`)

        app.get(`/${database.name}`, (req, res) => {

            const query = prepareQuery(req.query)

            dbLoader.getDb(database.name)
                .then(db => {

                    if (query.paginate){
                        
                        const skip = query.fieldsPaginate._perpage * query.fieldsPaginate._page 
                            - query.fieldsPaginate._perpage

                        db.find(query.fieldsQuery)
                        .skip(skip)
                        .limit(query.fieldsPaginate._perpage)
                        .exec((err, docs) => {
                            if (err)
                                res.sendStatus(500).send(err)
                            else{
                                res.setHeader('Content-Type', 'application/json')
                                res.send({_perpage: query.fieldsPaginate._perpage,
                                    _page: query.fieldsPaginate._page,
                                    data: docs})
                            }
                        })

                    }else{
                        db.find(query.fieldsQuery, (err, docs) => {
                            if (err)
                                res.sendStatus(500).send(err)
                            else{
                                res.setHeader('Content-Type', 'application/json')
                                res.send(docs)
                            }
                        })
                    }

                }).catch(err => {
                    res.send(err)
                })

        })

        app.get(`/${database.name}/count`, (req, res) => {

            const query = prepareQuery(req.query)

            dbLoader.getDb(database.name)
                .then(db => {
                    db.count(query.fieldsQuery)
                    .exec((err, count) => {
                        if (err)
                            res.sendStatus(500).send(err)
                        else{
                            res.setHeader('Content-Type', 'application/json')
                            res.send({count})
                        }
                    })
                }).catch(err => {
                    res.send(err)
                })
        })

        app.post(`/${database.name}`, (req, res) => {

            const doc = req.body

            dbLoader.getDb(database.name)
                .then(db => {
                    db.insert(doc, (err, newDoc) => {
                        if (err)
                            res.sendStatus(500).send(err)
                        else{
                            res.setHeader('Content-Type', 'application/json')
                            res.send(newDoc)
                        }
                    })
                }).catch(err => {
                    res.send(err)
                })
        })        

        app.put(`/${database.name}/:id`, (req, res) => {

            const doc = req.body
            const query = {_id: req.params.id}

            dbLoader.getDb(database.name)
                .then(db => {

                    db.update(query, doc, {returnUpdatedDocs:true},
                        (err, numAffected, affectedDocuments, upsert) => {
                            if (err)
                                res.sendStatus(500).send(err)
                            else{
                                res.setHeader('Content-Type', 'application/json')
                                res.send(affectedDocuments)
                            }
                        })

                }).catch(err => {
                    res.send(err)
                })
        })

        app.delete(`/${database.name}/:id`, (req, res) => {

            const query = {_id: req.params.id}

            dbLoader.getDb(database.name)
                .then(db => {

                    db.remove(query, {}, (err, numRemoved) => {
                        if (err)
                            res.sendStatus(500).send(err)
                        else{
                            res.setHeader('Content-Type', 'application/json')
                            res.send({removed: numRemoved})
                        }
                    })

                }).catch(err => {
                    res.send(err)
                })
        })

    })
}

/**
 * 
 * @param {Object} queryString Objeto Express Request.query com todos os campos que serão
 * 
 * @returns {Object} um objeto no padrão para auxliar nas pesquisas no NeDB
 *              Formato:
 *              {paginate: "true se tem paginação", 
 *               fieldsPaginate: {_perpage:"registros por página",_page:"página atual" }, 
 *               fieldsQuery: {campos da query}}
 */
function prepareQuery(queryString){

    const keys = Object.keys(queryString)
    let paginate = keys.includes('_perpage') && keys.includes('_page') ? true : false
    const fieldsQuery = {}
    const fieldsPaginate = {}

    keys.forEach((field, index)=>{
        let value = queryString[field].trim()

        if(field == '_perpage' || field == '_page'){
            if (!isNaN(value)){
                fieldsPaginate[field] = Number.parseFloat(value)
            }else{
                fieldsPaginate[field] = 0
                paginate = false
            }
            return
        }

        if ( ['true', 'false'].includes( value.toLowerCase() ) ){
            fieldsQuery[field] = value.toLowerCase() === "true" ? true : false
        }
        else if ( /^\/.*\/\w?$/.test(value) ) {
            
            let finalChar = /.$/.exec(value)

            if ( finalChar[0].endsWith('/')){
                fieldsQuery[field] = new RegExp( value.substring(1, value.length -1))
            } else {
                fieldsQuery[field] = new RegExp( value.substring(1, value.length -2), finalChar )
            }
        }
        else if ( !isNaN(value) ){
            fieldsQuery[field] = Number.parseFloat(value)
        }
        else
            fieldsQuery[field] = value

    })

    return {paginate, fieldsPaginate, fieldsQuery} 
}

module.exports = routers