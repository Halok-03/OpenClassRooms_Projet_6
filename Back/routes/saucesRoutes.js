const express = require ('express') 
const router = express.Router()
const auth = require('../middleware/auth')
const saucesControllers = require('../controllers/saucesControllers')

router.get('/', auth, saucesControllers.getAllSauces) 
router.get('/:id', auth, saucesControllers.getOneSauce) 
/*router.post('/', auth, saucesControllers.createSauce)
router.put('/:id', auth, saucesControllers.modifySauce)
router.delete('/:id', auth, saucesControllers.deleteOneSauce)
router.post('/:id/like', auth, saucesControllers.postLike)*/

module.exports = router