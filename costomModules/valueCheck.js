
const { ErrorHandler } = require('./customError')

module.exports = isEmpty = function(valueName, value){
    if(!value || value == "" || value == null || value == undefined){
        throw new ErrorHandler(400, valueName + ' is null')
    }
}