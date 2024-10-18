const Folder = require('../Models/Folder');
const { v4: uuidv4 } = require('uuid');

// Fonction pour créer un nouveau dossier
exports.createFolder = async (req, res) => {
  try {
    // Récupère les données de la requête
    const { title, tags, userId } = req.body;
    
    // Crée un nouveau dossier avec un ID unique
    const newFolder = await Folder.create({
      id: uuidv4(),
      title: title,
      tags: tags,
      userId: userId,
    });
    
    // Renvoie le dossier créé avec un statut 201
    res.status(201).json({ folder: newFolder });
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la création d\'un dossier :', error);
    res.status(500).json({ message: 'Erreur lors de la création d\'un dossier' });
  }
};

// Fonction pour récupérer tous les dossiers
exports.getAllFolder = async (req, res) => {
  try {
    // Récupère tous les dossiers
    const folders = await Folder.find();
    
    // Renvoie les dossiers avec un statut 200
    res.status(200).json(folders);
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la récupération des dossiers :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des dossiers' });
  }
};

// Fonction pour récupérer un dossier par son ID
exports.getFolderById = async (req, res) => {
  try {
    const folderId = req.params.id;
    
    // Cherche un dossier avec l'ID fourni
    const folder = await Folder.findById(folderId);
    if (!folder) {
      // Si le dossier n'est pas trouvé, renvoie un statut 404
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    
    // Renvoie le dossier trouvé avec un statut 200
    res.status(200).json(folder);
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la récupération d\'un dossier :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération d\'un dossier' });
  }
};

// Fonction pour récupérer les dossiers par userId
exports.getFoldersByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Cherche les dossiers avec le userId fourni
    const folders = await Folder.find({ userId: userId });
    if (!folders || folders.length === 0) {
      // Si aucun dossier n'est trouvé, renvoie un message avec un statut 200
      return res.status(200).json({ message: 'Aucun dossier trouvé pour cet utilisateur' });
    }
    
    // Renvoie les dossiers trouvés avec un statut 200
    res.status(200).json(folders);
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la récupération des dossiers par userId :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des dossiers par userId' });
  }
};

// Fonction pour supprimer un dossier par son ID
exports.deleteFolderById = async (req, res) => {
  try {
    const folderId = req.params.id;
    
    // Supprime le dossier par son ID
    const folder = await Folder.findOneAndDelete({id :folderId});
    if (!folder) {
      // Si le dossier n'est pas trouvé, renvoie un statut 404
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    
    // Renvoie un message de succès avec un statut 200
    res.status(200).json({ message: 'Dossier supprimé avec succès' });
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la suppression d\'un dossier :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression d\'un dossier' });
  }
};