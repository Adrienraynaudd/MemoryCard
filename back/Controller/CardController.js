// controllers/userController.js
const Card = require('../Models/Card');

exports.createCard = async (req, res) => {
  try {
    const { question, response, userId } = req.body;

    const newCard = await Card.create({
      question: question,
      response: response,
      userId: userId,
    });
    res.status(201).json({ card: newCard });
  } catch (error) {
    console.error('Erreur lors de la création d\'une carte :', error);
    res.status(500).json({ message: 'Erreur lors de la création d\'une carte' });
  }
};

exports.getCardById = async (req, res) => {
  try {
      const cardId = req.params.id;
      const card = await Card.findById(cardId);
      if (!card) {
          return res.status(404).json({ message: 'Carte non trouvé' });
      }
      res.status(200).json(card);
  } catch (error) {
      console.error('Erreur lors de la récupération d\'une carte :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération d\'une carte' });
  }
};

exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des cartes' });
  }
};

exports.updateCardById = async (req, res) => {
  try {
    const cardId = req.params.id;
    const { question, response } = req.body;

    // Préparer l'objet de mise à jour
    const updateObj = {
      question,
      response,
    };

    // Trouver la carte par ID et mettre à jour
    const updatedCard = await Card.findByIdAndUpdate(cardId, updateObj, { new: true });

    if (!updatedCard) {
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la carte :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la carte' });
  }
};

  
exports.deleteCardById = async (req, res) => {
  try {
      const cardId = req.params.id;

      // Supprime l'utilisateur par son ID
      const result = await Card.deleteOne({ _id: cardId });

      // Vérifie si un utilisateur a été supprimé
      if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Carte non trouvé' });
      }

      res.status(204).send();
  } catch (error) {
      console.error('Erreur lors de la suppression d\'une carte :', error);
      res.status(500).json({ message: 'Erreur lors de la suppression d\'une carte' });
  }
};

  exports.getUserByEmailAndPassword = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Card.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
      const token = jwt.sign({ userId: user.id, username: user.username }, 'TjPJIv2wnVUdflrb', { expiresIn: '1h' });
  
      res.status(200).json({ user, token });
    } catch (error) {
      console.error('Erreur lors de l\'authentification de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de l\'authentification de l\'utilisateur' });
    }
  };