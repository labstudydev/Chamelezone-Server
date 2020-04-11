const express       = require('express')
const router        = express.Router()
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

router.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, '../views/index.hbs'))
    response.status(200).end('router get success')
})

router.use("/user", user)
router.use("/place", place)
router.use("/image", image)
router.use("/map", map)
router.use("/keyword", keyword)
router.use("/search", search)
router.use("/review", review)
router.use("/course", course)
router.use("/like", like)

module.exports = router