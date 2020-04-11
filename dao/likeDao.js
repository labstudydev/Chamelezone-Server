const { ErrorHandler }      = require('../costomModules/customError')
const db                    = require('../config/db')

var Like = function(like) { }

Like.insertLike = function([placeNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const insertLikeSqlQuery = `INSERT INTO like_history (placeNumber, memberNumber) VALUES (?, ?)`
            connection.query(insertLikeSqlQuery, [placeNumber, memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Like.deleteLike = function([placeNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const deleteLikeSqlQuery = `DELETE FROM like_history WHERE placeNumber = ? AND memberNumber = ?`
            connection.query(deleteLikeSqlQuery, [placeNumber, memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Like.selectAllByUserLikes = function([memberNumber], response) {
    try {
        db((error, connection) => {
            const selectAllByUserLikesSqlQuery = `SELECT LH.likeNumber, LH.placeNumber, LH.memberNumber, P.name, P.address, P.addressDetail, A.keywordNumber, A.keywordName, ` +
                                                    `GROUP_CONCAT(PI.imageNumber SEPARATOR ',') AS 'imageNumber', ` +
                                                    `GROUP_CONCAT(PI.savedImageName SEPARATOR ',') AS 'savedImageName' ` +
                                                    `FROM like_history LH ` +
                                                    `LEFT JOIN place P ON P.placeNumber = LH.placeNumber ` +
                                                    `LEFT JOIN place_images PI ON PI.placeNumber = LH.placeNumber ` +
                                                    `LEFT JOIN (select PHK.placeNumber, GROUP_CONCAT(K.keywordNumber ORDER BY PHK.placeKeywordNumber SEPARATOR ',') AS 'keywordNumber', GROUP_CONCAT(K.name ORDER BY PHK.placeKeywordNumber SEPARATOR ',') AS 'keywordName' ` +
                                                    `       FROM place_has_keyword PHK ` +
                                                    `        JOIN keyword K ON K.keywordNumber = PHK.keywordNumber ` +
                                                    `        GROUP BY placeNumber ` +
                                                    `        ORDER BY placeNumber ASC) A ON A.placeNumber = LH.placeNumber ` +
                                                    `WHERE LH.memberNumber = ? ` +
                                                    `GROUP BY LH.likeNumber ` +
                                                    `ORDER BY likeNumber DESC`
            connection.query(selectAllByUserLikesSqlQuery, [memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

Like.selectOneByUserLike = function([placeNumber, memberNumber], response) {
    try {
        db((error, connection) => {
            const selectOneByUserLikeSqlQuery = `SELECT likeNumber, placeNumber, memberNumber FROM like_history WHERE placeNumber = ? and memberNumber = ?`
            connection.query(selectOneByUserLikeSqlQuery, [placeNumber, memberNumber], function(error, results) {
                connection.release()
                if (error) { return response(error, null) }
                else { response(null, results) }
            })
        })
    } catch (error) {
        throw new ErrorHandler(500, error)
    }
}

module.exports = Like