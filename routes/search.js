const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const response = await fetch('https://api.deezer.com/').then(res => res.json());
    res.send(response);
})

module.exports = router;