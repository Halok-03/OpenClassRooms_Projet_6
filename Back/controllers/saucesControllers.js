const SauceModel  = require('../models/saucesModels') // Import du models sauces //
const fs = require('fs') // Fs (File System) donne accés aux fonctions qui permettent de modifier le système de fichiers y compris aux fonctions qui permettent de les supprimer

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

// post sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce) // On parse la requète puisque l'objet est envoyé en chaine de caractère du à l'image
    delete sauceObject._id // On supprime l'id car il va être généré par la DB
    delete sauceObject._userId // On supprime l'userId pour ne pas faire confiance au client par mesure de sécurité. On preferera utilisé le token ID car on est sur quil est valide
    const newSauce = new SauceModel({ // On créer ensuite une nouvelle sauce 
        ...sauceObject,  // On reprend les modifications de l'objet plus haut
        userId: req.auth.userId, // On prend le token ID pour être sur qu'il est valide
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // On créer un url pour l'image avec ce que nous envoie la requete
        likes: 0, // On intialise les likes,dislikes à 0 et les tableaux vides (car personne n'a enbcore liké au moment de créer la sauce)
        dislikes: 0, 
        usersLiked: [],
        usersDisliked: [],
    });
    newSauce.save()
    .then( () => { res.status(201).json({ message: 'Sauce enregistré avec succés!' })}
    ).catch((error) => { res.status(400).json({ error: error })}
    );
}

// put one sauce
exports.modifySauce =  (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body}
    delete sauceObject._userId
    SauceModel.findOne({_id: req.params.id})
    .then((sauce) => { 
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({ message : "unauthorized request" })
        } else {
            const filename = sauce.imageUrl.split('/images/')[1] // Nous récupérons le liens qui mene au fichier dans le dossier images
            fs.unlink(`images/${filename}`, () => { // grace a 'fs' qu enous avons importé en haut nous utilisons la methode unlink afin de supprimer le fichier image dans le dossier images
                SauceModel.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(res.status(201).json({ message: 'Sauce modifiée avec succés!' }))
                .catch((error) => { res.status(400).json({ error: error })})
            })
        }
    })
    .catch((error) => { res.status(500).json({ error: error })})
  }

// Delete one sauce
exports.deleteOneSauce = (req, res, next) => {
    SauceModel.findOne({_id: req.params.id}) // On identifie la sauce a supprimer grace a l'id params //
    .then((sauce) => { 
        if (sauce.userId != req.auth.userId) { // Ensuite on vérifie que le token correspondent a l'id , si ce n'est pas le cas nous n'authorisons pas la requete //
            res.status(403).json({ message : "unauthorized request" })
        }else {
            const filename = sauce.imageUrl.split('/images/')[1] // Nous récupérons le liens qui mene au fichier dans le dossier images
            fs.unlink(`images/${filename}`, () => { // grace a 'fs' qu enous avons importé en haut nous utilisons la methode unlink afin de supprimer le fichier image dans le dossier images
                SauceModel.deleteOne({_id: req.params.id}) // Ensuite nous supprimons dans la DB
                .then(() => { res.status(200).json({ message: 'Deleted!' })}
                ).catch((error) => { res.status(400).json({ error: error })}
                )
            })
        }
    }) 
    .catch((error) => { res.status(500).json({ error: error })})
}

exports.postLike = (req, res, next) => {
    SauceModel.findOne({_id: req.params.id})  // On identifie la sauce a supprimer grace a l'id params //
    .then ((sauce) => {
        if (req.body.like === 1 ) {
          SauceModel.findByIdAndUpdate(req.params.id, {
            ...sauce,
            likes: sauce.likes++,
            usersLiked: sauce.usersLiked.push(req.auth.userId),
          })
            .then(() => res.status(200).json({ message: 'Sauce liked !' }))
            .catch(error => res.status(401).json({ error }));
        }else if (req.body.like === -1) {
          SauceModel.findByIdAndUpdate(req.params.id, {
            ...sauce,
            dislikes: sauce.dislikes++,
            usersDisliked: sauce.usersDisliked.push(req.auth.userId),
          })
            .then(() => res.status(200).json({ message: 'Sauce disliked !' }))
            .catch(error => res.status(401).json({ error }));
        }else if (req.body.like === 0) {
            if (sauce.usersLiked.includes(req.auth.userId)){
              const indexOfUser = sauce.usersLiked.indexOf(req.auth.userId)
              SauceModel.findByIdAndUpdate(req.params.id, {
                ...sauce,
                likes: sauce.likes--,
                usersLiked: sauce.usersLiked.splice(indexOfUser, 1)
              })
              .then(() => res.status(200).json({ message: 'Sauce unliked' }))
              .catch(error => res.status(401).json({ error }));
            }
            if (sauce.usersDisliked.includes(req.auth.userId)){
              const indexOfUser = sauce.usersDisliked.indexOf(req.auth.userId)
              SauceModel.findByIdAndUpdate(req.params.id, {
                ...sauce,
                dislikes: sauce.dislikes--,
                usersDisliked: sauce.usersDisliked.splice(indexOfUser, 1)
              })
              .then(() => res.status(200).json({ message: 'Sauce unliked' }))
              .catch(error => res.status(401).json({ error }));
            }
        }
    }).catch((error) => { res.status(500).json({ error: error })})
}

 