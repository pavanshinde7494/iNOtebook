const express = require('express');
const router = express.Router();

router.get('/' , (req,res)=>{
    res.json({
        a : 'Pavan' ,
        number : 34
    });
})

module.exports = router;