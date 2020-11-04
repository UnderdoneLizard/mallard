const express = require("express");
const MulterGridfsStorage = require("multer-gridfs-storage");
const router = express.Router();

const upload = require("../middleware/upload");
const db = require("../models");

router.get('/', async (req, res) => {
    try{

        //console.log(db.gfs.find())
        res.render('upload')

    } catch(error) {
        console.log(error);
        return res.send(`Error when trying upload image: ${error}`);
    }

})

router.post('/', async (req, res) =>{

    try {
        await upload(req, res);
        const user = await db.User.findById(req.session.currentUser.id);
        console.log(req.file);
        if (req.file == undefined) {
            return res.send(`You must select a file.`);
        }
        user.userIcon = req.file.id;
        user.save();
        return res.redirect(`/upload`);
      } catch (error) {
        console.log(error);
        return res.send(`Error when trying upload image: ${error}`);
      }

})


module.exports = router;