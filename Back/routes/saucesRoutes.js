const express = require ('express') 
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const saucesControllers = require('../controllers/saucesControllers')

router.get('/', auth, saucesControllers.getAllSauces) 
router.get('/:id', auth, saucesControllers.getOneSauce) 
router.post('/', auth, multer, saucesControllers.createSauce)
router.put('/:id', auth, multer, saucesControllers.modifySauce)
router.delete('/:id', auth, saucesControllers.deleteOneSauce)
router.post('/:id/like',  auth, saucesControllers.postLike)

module.exports = router