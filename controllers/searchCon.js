const express = require("express");
const router = express.Router();

const db = require("../models");

//search routes
//TODO refactor this to recieve results from the search... i think, or I could re render the page, I think that's what will happen we will see 
router.get('/', (req, res) => {

    res.render('core/search', {results: undefined});

})

router.post('/', async (req, res) => {
    try { 
        console.log(req.body)
        const results = await db.User.find({ $text: { $search: req.body.search }});
        console.log(results);
        context = {
            results: results,
            title: "Search Results"
        };
        res.render('core/search', context);

    } catch(error) {

    }
})


module.exports = router;