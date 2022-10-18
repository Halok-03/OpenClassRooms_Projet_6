const SauceModel  = require('../models/saucesModels') // Import du models sauces //

// get all sauces 
exports.getAllSauces = (req, res, next) => {
    SauceModel.find()
    .then((sauces) => { res.status(200).json(sauces)}
    ).catch((error) => { res.status(400).json({ error: error })})
}

// get one sauce
exports.getOneSauce = (req, res, next) => {
    SauceModel.findOne({_id: req.params.id})
    .then((sauce) => {res.status(200).json(sauce);}
    ).catch((error) => {res.status(404).json({error: error})}
    )
};
