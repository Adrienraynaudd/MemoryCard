// controllers/userController.js
const Card = require('../Models/Card');
const { v4: uuidv4 } = require('uuid');

// Fonction pour créer une nouvelle carte
exports.createCard = async (req, res) => {
  try {
    // Récupère les données de la requête
    const { question, response, userId, folderId} = req.body;
    console.log(req.body);
    
    // Crée une nouvelle carte avec un ID unique
    const newCard = await Card.create({
      id: uuidv4(),
      question: question,
      response: response,
      userId: userId,
      folderId: folderId,
    });
    
    // Renvoie la carte créée avec un statut 201
    res.status(201).json({ card: newCard });
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la création d\'une carte :', error);
    res.status(500).json({ message: 'Erreur lors de la création d\'une carte' });
  }
};

// Fonction pour récupérer une carte par son ID
exports.getCardById = async (req, res) => {
  try {
      const cardId = req.params.id;
      
      // Cherche une carte avec l'ID fourni
      const card = await Card.findOne({ id: userId });
      if (!card) {
          // Si la carte n'est pas trouvée, renvoie un statut 404
          return res.status(404).json({ message: 'Carte non trouvé' });
      }
      
      // Renvoie la carte trouvée avec un statut 200
      res.status(200).json(card);
  } catch (error) {
      // Gère les erreurs et renvoie un statut 500
      console.error('Erreur lors de la récupération d\'une carte :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération d\'une carte' });
  }
};

// Fonction pour récupérer toutes les cartes
exports.getAllCards = async (req, res) => {
  try {
    // Récupère toutes les cartes
    const cards = await Card.find();
    
    // Renvoie les cartes avec un statut 200
    res.status(200).json(cards);
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la récupération des cartes :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des cartes' });
  }
};

// Fonction pour mettre à jour une carte par son ID
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
    const updatedCard = await Card.findByIdAndUpdate({id :cardId}, updateObj, { new: true });

    if (!updatedCard) {
      // Si la carte n'est pas trouvée, renvoie un statut 404
      return res.status(404).json({ message: 'Carte non trouvée' });
    }

    // Renvoie la carte mise à jour avec un statut 200
    res.status(200).json(updatedCard);
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la mise à jour de la carte :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la carte' });
  }
};

// Fonction pour supprimer une carte par son ID
exports.deleteCardById = async (req, res) => {
  try {
      const cardId = req.params.id;

      // Supprime la carte par son ID
      const result = await Card.deleteOne({ id: cardId });

      // Vérifie si une carte a été supprimée
      if (result.deletedCount === 0) {
          // Si la carte n'est pas trouvée, renvoie un statut 404
          return res.status(404).json({ message: 'Carte non trouvé' });
      }

      // Renvoie un statut 204 pour indiquer que la suppression a réussi
      res.status(204).send();
  } catch (error) {
      // Gère les erreurs et renvoie un statut 500
      console.error('Erreur lors de la suppression d\'une carte :', error);
      res.status(500).json({ message: 'Erreur lors de la suppression d\'une carte' });
  }
};