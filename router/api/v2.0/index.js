const express       = require('express')
const v2            = express.Router()
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

v2.get("/", (request, response) => {
    // response.sendFile(path.join(__dirname, '../../views/index.hbs'))
    response.sendFile(path.join(__dirname, '/views/index.hbs'))
    response.status(200).end('v2.0 version get success')
})

v2.use("/v2.0/user", user)
v2.use("/v2.0/place", place)
v2.use("/v2.0/image", image)
v2.use("/v2.0/map", map)
v2.use("/v2.0/keyword", keyword)
v2.use("/v2.0/search", search)
v2.use("/v2.0/review", review)
v2.use("/v2.0/course", course)
v2.use("/v2.0/like", like)

module.exports = v2