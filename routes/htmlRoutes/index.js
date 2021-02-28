const path = require('path');
const router = require('express').Router();



//-------------------------GET ROUTES
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../../public/index'));
});

router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'../../public/notes.html'));
});

module.exports = router;