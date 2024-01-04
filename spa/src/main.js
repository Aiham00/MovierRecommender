
const awilix = require('awilix')
const container = awilix.createContainer()

container.register({
    app: awilix.asFunction(require('./app.js')),

})


container.resolve('app').listen(8040, function () {
    console.log('RUNNING spa')
})
