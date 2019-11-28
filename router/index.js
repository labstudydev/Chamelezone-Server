/* ==================== START modules ==================== */
const express       = require('express');
const router        = express.Router();
const path          = require('path');
const user          = require('./user/user');
const place         = require('./place/place');
/* ==================== END modules ==================== */

// url routing
router.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, '../views/index.hbs'));
    response.status(200).end("router get success");
});

/* ==================== START router ==================== */
router.use("/user", user);          // member
router.use("/place", place);        // place
/* ==================== END router ==================== */

module.exports = router;