const express = require("express");
const router = express.Router();

const db = require("../models");

//search routes
//TODO refactor this to recieve results from the search... i think, or I could re render the page, I think that's what will happen we will see 
router.get('/', (req, res) => {
    res.render('core/search');
})


module.exports = router;