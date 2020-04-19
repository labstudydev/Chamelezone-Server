const express       = require('express')
const router        = express.Router()
const path          = require('path')

const user          = require('./api/v2.0/user/user')
const place         = require('./api/v2.0/place/place')
const image         = require('./api/v2.0/imageDir/image')
const map           = require('./api/v2.0/map/map')
const keyword       = require('./api/v2.0/keyword/keyword')
const search        = require('./api/v2.0/search/search')
const review        = require('./api/v2.0/review/review')
const course        = require('./api/v2.0/course/course')
const like          = require('./api/v2.0/like/like')

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