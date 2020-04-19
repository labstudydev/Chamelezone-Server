const express       = require('express')
const v1            = express.Router()
const path          = require('path')

const user          = require('./user/user')
const place         = require('./place/place')
const image         = require('./imageDir/image')
const map           = require('./map/map')
const keyword       = require('./keyword/keyword')
const search        = require('./search/search')
const review        = require('./review/review')
const course        = require('./course/course')
const like          = require('./like/like')

v1.get("/", (request, response) => {
    // response.sendFile(path.join(__dirname, '../../views/index.hbs'))
    response.sendFile(path.join(__dirname, '/views/index.hbs'))
    response.status(200).end('v1.0 version get success')
})

v1.use("/v1.0/user", user)
v1.use("/v1.0/place", place)
v1.use("/v1.0/image", image)
v1.use("/v1.0/map", map)
v1.use("/v1.0/keyword", keyword)
v1.use("/v1.0/search", search)
v1.use("/v1.0/review", review)
v1.use("/v1.0/course", course)
v1.use("/v1.0/like", like)

module.exports = v1