const { ErrorHandler }  	= require('../costomModules/customError')
const User					= require('../dao/userDao')
const Step					= require('../node_modules/step')

var util = { }

util.createPasswordSecurityCode = function() {
    var characters = '!@#$%^&*+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var securityCode_length = 16
    var securityCode = ''
    for (var i = 0; i < securityCode_length; i++) {
        var randomValue = Math.floor(Math.random() * characters.length)
        securityCode += characters.substring(randomValue, randomValue + 1)
    }
        
    return securityCode
}

util.isLoginCheck = function(memberNumber) {	
	if(!memberNumber || memberNumber == "" || memberNumber == null || memberNumber == undefined){
        throw new ErrorHandler(400, memberNumber + ' is null')
	}

	Step (
		function selectLoginUser() {
			User.selectByMemberNumber(memberNumber, this)
		},
		function result (error, result) {
			if (error) {
				throw new ErrorHandler(500, error)
			}
			if (memberNumber != result[0].memberNumber) {
				throw new ErrorHandler(404, "login memberNumber is not match")
			}
			
			return result[0].memberNumber
		}
	)
	return true
}

util.resultStringToArray = function(results, keyList) {
	const list = Array.isArray(keyList) ? keyList : [keyList]
	const resultList = Array.isArray(results) ? results : [results]

	resultList.forEach((target) => {
		list.forEach((key) => {
			target[key]  = target[key].split(",")
		})
	})

	return results
}

module.exports = util