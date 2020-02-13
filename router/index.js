/* ==================== START modules ==================== */

const express       = require('express')
const router        = express.Router()
const path          = require('path')

const user          = require('./user/user')
const place         = require('./place/place')
const images        = require('./imageDir/image')
const map           = require('./map/map')
const keyword       = require('./keyword/keyword')
const search        = require('./search/search')
const review        = require('./review/review')
const course        = require('./course/course')

/* ==================== END modules ==================== */

// url routing
router.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, '../views/index.hbs'))
    response.status(200).end("router get success")
})

/* ==================== START router ==================== */

router.use("/user", user)             // member
router.use("/place", place)           // place
router.use("/image", image)           // images
router.use("/map", map)               // map
router.use("/keyword", keyword)       // keyword
router.use("/search", search)         // search
router.use("/review", review)         // review
router.use("/course", course)         // course

/* ==================== END router ==================== */

module.exports = router