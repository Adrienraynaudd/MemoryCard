const Folder = require('../Models/Folder');
const { v4: uuidv4 } = require('uuid');

exports.createFolder = async (req, res) => {
  try {
    const { name, tags, userId } = req.body;

    const newFolder = await Folder.create({
      id: uuidv4(),
      name: name,
      tags: tags,
      userId: userId,
    });
    res.status(201).json({ folder: newFolder });
  } catch (error) {
    console.error('Erreur lors de la création d\'un dossier :', error);
    res.status(500).json({ message: 'Erreur lors de la création d\'un dossier' });
  }
};

exports.getAllFolder = async (req, res) => {
  try {
    const folders = await Folder.find();
    res.status(200).json(folders);
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des dossiers' });
  }
};

exports.getFolderById = async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    res.status(200).json(folder);
  } catch (error) {
    console.error('Erreur lors de la récupération d\'un dossier :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération d\'un dossier' });
  }
};

exports.getFoldersByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const folders = await Folder.find({ 'userId.userId': userId });
    if (!folders || folders.length === 0) {
      return res.status(404).json({ message: 'Aucun dossier trouvé pour cet utilisateur' });
    }
    res.status(200).json(folders);
  } catch (error) {
    console.error('Erreur lors de la récupération des dossiers par userId :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des dossiers par userId' });
  }
};

exports.deleteFolderById = async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findByIdAndDelete(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }
    res.status(200).json({ message: 'Dossier supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un dossier :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression d\'un dossier' });
  }
};