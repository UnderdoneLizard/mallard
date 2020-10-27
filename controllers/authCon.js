const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { render } = require("ejs")

/* BASE TEST PATH */
router.get("/", (req,res) => {
    res.render('auth/test');
})



module.exports = router;