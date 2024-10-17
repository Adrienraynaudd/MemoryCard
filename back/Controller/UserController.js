// controllers/userController.js
const User = require('../Models/User');
const { authenticateToken } = require('../Middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, school, city,FavoriteFolder } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      id: uuidv4(),
      username: username,
      email: email,
      password: hashedPassword,
      school: school,
      city: city,
      FavoriteFolder: FavoriteFolder,
    });
    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, 'TjPJIv2wnVUdflrb');
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};

exports.getUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findOne({ id: userId });
      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};
exports.updateUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      const { username, email, password, school, city } = req.body;

      // Hash the new password if provided
      let hashedPassword;
      if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
      }

      // Prepare the update object
      const updateObj = {
          username,
          email,
          school,
          city,
      };
      // Add hashed password to update object if it exists
      if (hashedPassword) {
          updateObj.password = hashedPassword;
      }

      // Find the user by id and update
      const updatedUser = await User.findOneAndUpdate(
        { id: id },
        updateObj,
        { new: true, useFindAndModify: false });

      if (!updatedUser) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.status(200).json(updatedUser);
  } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
      const userId = req.params.id;

      // Supprime l'utilisateur par son ID
      const result = await User.deleteOne({ id: userId });

      // Vérifie si un utilisateur a été supprimé
      if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.status(204).send();
  } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};

  exports.getUserByEmailAndPassword = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
      const token = jwt.sign({ userId: user.id, username: user.username }, 'TjPJIv2wnVUdflrb');
  
      res.status(200).json({ user, token });
    } catch (error) {
      console.error('Erreur lors de l\'authentification de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de l\'authentification de l\'utilisateur' });
    }
  };
  exports.getFavoriteFolders = async (req, res) => {
    try {
      const userId = req.params.id || 'defaultId'; 
      const user = await User.findOne({ id: userId }).populate('FavoriteFolder');
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json(user.FavoriteFolder);
    } catch (error) {
      console.error('Erreur lors de la récupération des dossiers favoris :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des dossiers favoris' });
    }
  };
  exports.addFolderIdToFavorite = async (req, res) => {
    try {
      const userId = req.params.id || 'defaultId';
      const  folder  = req.body;
      const user = await User.findOne({ id: userId }).populate('FavoriteFolder');
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Vérifiez si le dossier est déjà dans les favoris
      if (user.FavoriteFolder.find(f => typeof f === 'object' ? f.id === folderId : f === folderId)) {
        return res.status(400).json({ message: 'Le dossier est déjà dans les favoris' });
      }
  
      // Ajoutez le dossier aux favoris
      console.log('Dossier à ajouter aux favoris:', folder);
      if (folder && folder.id) {
        user.FavoriteFolder.push(folder.id);
        await user.save();
        res.status(200).json({ message: 'Dossier ajouté aux favoris' });
      } else {
        res.status(400).json({ message: 'Dossier non valide' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du dossier aux favoris :', error);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du dossier aux favoris' });
    }
  };
  exports.removeFolderIdFromFavorite = async (req, res) => {
    try {
      const userId = req.params.id || 'defaultId';
      const  folderId  = req.params.folderId;
      const user = await User.findOne({ id: userId }).populate('FavoriteFolder');
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      console.log('Dossier à retirer des favoris:', user.FavoriteFolder);
      console.log('ID du dossier à retirer des favoris:', folderId);
      if (!user.FavoriteFolder.find(f => f === folderId)) {
        return res.status(400).json({ message: 'Le dossier n\'est pas dans les favoris' });
      }
  
      // Retirez le dossier des favoris
      user.FavoriteFolder = user.FavoriteFolder.filter(f => f !== folderId);
      await user.save();
  
      res.status(200).json({ message: 'Dossier retiré des favoris' });
    } catch (error) {
      console.error('Erreur lors de la suppression du dossier des favoris :', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du dossier des favoris' });
    }
  }