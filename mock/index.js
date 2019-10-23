
const bodyParser = require('body-parser')
// const chalk = require('chalk')
// const path = require('path')

module.exports = function (app) {
    require('@babel/register')

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true,
    }))


    // console.info(app._router.stack)
}
