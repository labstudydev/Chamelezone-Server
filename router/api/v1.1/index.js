const express       = require('express')
const v1_1          = express.Router()
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
const release       = require('./release/release')

v1_1.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, '/views/index.hbs'))
    response.status(200).end('v1.1 version get success')
})

v1_1.use("/v1.1/user", user)
v1_1.use("/v1.1/place", place)
v1_1.use("/v1.1/image", image)
v1_1.use("/v1.1/map", map)
v1_1.use("/v1.1/keyword", keyword)
v1_1.use("/v1.1/search", search)
v1_1.use("/v1.1/review", review)
v1_1.use("/v1.1/course", course)
v1_1.use("/v1.1/like", like)
v1_1.use("/v1.1/release", release)

module.exports = v1_1