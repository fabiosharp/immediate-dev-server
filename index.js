'use strict';

const app = require('./src/server/express')
const params = require('./src/config/params')

app.listen( params.port, function () {
    console.log(`Immediate server running on ${params.port}!`);
});
