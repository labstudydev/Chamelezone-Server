const { NullCheckErrorHandler } = require('./customError')

module.exports = isEmpty = function(nullValueCheckObject){
    Object.entries(nullValueCheckObject).forEach(([key, value]) =>{
        if(!value || value == "" || value == null || value == undefined){
            throw new NullCheckErrorHandler(400, key)
        }
    })
}