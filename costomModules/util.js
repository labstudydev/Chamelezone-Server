/* ==================== START modules ==================== */

const { ErrorHandler }      = require('../costomModules/customError')
const User					= require('../dao/userDao')
const Step					= require('../node_modules/step');

/* ==================== END modules ==================== */


var util = {

}

// util.isLoginCheck = function(request, response, next){
// 	let email = request
// 	console.log("무사입성")
// 	let result
// 	Step (
// 		function selectLoginUser() {
// 			console.log("step111111111111 ")
// 			User.selectByEmail(email, this)
// 		},
// 		function result (error, user) {
// 			console.log("step222222222222 ")
// 			if (error) {
// 				return next(new ErrorHandler(500, error))
// 			}
// 			return result = user
// 		}
// 	)
// 	console.log("++++++++++++++")
// 	console.log(result)
// 	// console.log("&&&&&&&&&&&&&&&&&&&& " + user)
// }

// util.isLoginCheck = function(request, response, next){
// 	let email = request
	
// 	if(!email) {
// 		// throw new ErrorHandler(404, "login is null !!!")
// 		response.status(404).send("로그인이 안되있어!!")
// 	} 
// 	else {
// 		User.selectByEmail(email, function(error, user) {
// 			if (error) {
// 				return next(new ErrorHandler(500, error))
// 			}

// 			if (user.length == 0 || user.length == undefined) {
// 				response.status(404).send("User does not exist" )
// 			} else {
// 				return 0
// 			}
// 		})
// 	}
// }

// util.isLoginCheck = function(request, response, next){
// 	let email = request
// 	User.selectByEmail(email, function(error, user) {
// 		if (error) {
// 			return next(new ErrorHandler(500, error))
// 		}

// 		if (user.length == 0 || user.length == undefined) {
// 			response.status(404).send("User does not exist" )
// 		} else {
// 			console.log(user[0] + user[0].email)
// 			// response.status(200).send(user[0].email)
// 			next(user[0].email)
// 		}
// 	})
// }

// module.exports = util

// module.exports = isLoginCheck = function(request, response){
// 	let email = request
// 	User.selectByEmail(email, function(error, user) {
// 		if (error) {
// 			// return next(new ErrorHandler(500, error))
// 			throw new ErrorHandler(500, error)
// 		}

// 		if (user.length == 0 || user.length == undefined) {
// 			throw new ErrorHandler(404, "User does not exist")
// 			// response.status(404).send("User does not exist")
// 		} else {
// 			console.log("||||||||||||||||"+user[0] + user[0].email)
// 			// response.status(200).send(user[0].email)
// 			// return response.status(200).send(user[0].email)
// 			return user[0].email
// 		}
// 	})
// }

const isLoginCheck = (request, response) => {
	let memberNumber = request
	console.log("나는" + memberNumber)
	
	if(!memberNumber || memberNumber == "" || memberNumber == null || memberNumber == undefined){
        throw new ErrorHandler(400, memberNumber + ' is null')
	}
	
	Step (
		// if ()
		function selectLoginUser() {
			console.log("step111111111111 ")
			User.selectByMemberNumber(memberNumber, this)
		},
		function result (error, result) {
			console.log("step222222222222 ")
			if (error) {
				return next(new ErrorHandler(500, error))
			}
			return result[0].memberNumber
		}
	)
	// User.selectByMemberNumber(memberNumber, function(error, user) {
	// 	if (error) {
	// 		// return next(new ErrorHandler(500, error))
	// 		throw new ErrorHandler(500, error)
	// 	}

	// 	if (user.length == 0 || user.length == undefined) {
	// 		throw new ErrorHandler(404, "User does not exist")
	// 		// response.status(404).send("User does not exist")
	// 	} else {
	// 		console.log("||||||||||||||||" + user[0] + user[0].email)
	// 		// response.status(200).send(user[0].email)
	// 		// return response.status(200).send(user[0].email)
	// 		return user[0].email
	// 	}
	// })
}

module.exports = isLoginCheck