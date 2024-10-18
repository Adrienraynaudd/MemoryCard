// controllers/userController.js
const User = require('../Models/User');
const { authenticateToken } = require('../Middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Folder = require('../Models/Folder');

// Fonction pour créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    // Récupère les données de la requête
    const { username, email, password, school, city, FavoriteFolder } = req.body;

    // Hache le mot de passe après l'avoir trim
    var trimpassword = password.trim();
    const hashedPassword = await bcrypt.hash(trimpassword, 10);
    
    // Crée un nouvel utilisateur avec un ID unique
    const newUser = await User.create({
      id: uuidv4(),
      username: username,
      email: email,
      password: hashedPassword,
      school: school,
      city: city,
      FavoriteFolder: FavoriteFolder,
    });
    
    // Génère un token JWT pour l'utilisateur
    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, 'TjPJIv2wnVUdflrb');
    
    // Renvoie l'utilisateur créé avec un statut 201
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};

// Fonction pour récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      
      // Cherche un utilisateur avec l'ID fourni
      const user = await User.findOne({ id: userId });
      if (!user) {
          // Si l'utilisateur n'est pas trouvé, renvoie un statut 404
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Renvoie l'utilisateur trouvé avec un statut 200
      res.status(200).json(user);
  } catch (error) {
      // Gère les erreurs et renvoie un statut 500
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};

// Fonction pour mettre à jour un utilisateur par son ID
exports.updateUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      const { username, email, password, school, city, FavoriteFolder } = req.body;

      let hashedPassword;
      if (password) {
        // Hache le mot de passe après l'avoir trim
        var trimpassword = password.trim();
        const hashedPassword = await bcrypt.hash(trimpassword, 10);
      }

      // Prépare l'objet de mise à jour
      const updateObj = {
          username,
          email,
          school,
          city,
          FavoriteFolder
      };
      // Ajoute le mot de passe haché à l'objet de mise à jour s'il existe
      if (hashedPassword) {
          updateObj.password = hashedPassword;
      }

      // Trouve l'utilisateur par ID et met à jour
      const updatedUser = await User.findOneAndUpdate(
        { id: userId },
        updateObj,
        { new: true, useFindAndModify: false });

      if (!updatedUser) {
          // Si l'utilisateur n'est pas trouvé, renvoie un statut 404
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Renvoie l'utilisateur mis à jour avec un statut 200
      res.status(200).json(updatedUser);
  } catch (error) {
      // Gère les erreurs et renvoie un statut 500
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
};

// Fonction pour supprimer un utilisateur par son ID
exports.deleteUserById = async (req, res) => {
  try {
      const userId = req.params.id;

      // Supprime l'utilisateur par son ID
      const result = await User.deleteOne({ id: userId });

      // Vérifie si un utilisateur a été supprimé
      if (result.deletedCount === 0) {
          // Si l'utilisateur n'est pas trouvé, renvoie un statut 404
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Renvoie un statut 204 pour indiquer que la suppression a réussi
      res.status(204).send();
  } catch (error) {
      // Gère les erreurs et renvoie un statut 500
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};

// Fonction pour récupérer un utilisateur par email et mot de passe
exports.getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cherche un utilisateur avec l'email fourni
    const user = await User.findOne({ email });
    if (!user) {
      // Si l'utilisateur n'est pas trouvé, renvoie un statut 404
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    console.log('Utilisateur trouvé:', user);
    console.log('Mot de passe fourni:', password);
    
    // Compare le mot de passe fourni avec le mot de passe haché
    var trimpassword = password.trim();
    const passwordMatch = await bcrypt.compare(trimpassword, user.password);

    if (!passwordMatch) {
      // Si le mot de passe ne correspond pas, renvoie un statut 500
      return res.status(500).json({ message: 'Mot de passe incorrect' });
    }
    
    // Génère un token JWT pour l'utilisateur
    const token = jwt.sign({ userId: user.id, username: user.username }, 'TjPJIv2wnVUdflrb');

    // Renvoie l'utilisateur et le token avec un statut 200
    res.status(200).json({ user, token });
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de l\'authentification de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de l\'authentification de l\'utilisateur' });
  }
};

// Fonction pour récupérer les dossiers favoris d'un utilisateur
exports.getFavoriteFolders = async (req, res) => {
  try {
    const userId = req.params.id || 'defaultId'; 
    
    // Cherche un utilisateur avec l'ID fourni et peuple les dossiers favoris
    const user = await User.findOne({ id: userId }).populate('FavoriteFolder');
    if (!user) {
      // Si l'utilisateur n'est pas trouvé, renvoie un statut 404
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Renvoie les dossiers favoris avec un statut 200
    res.status(200).json(user.FavoriteFolder);
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la récupération des dossiers favoris :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des dossiers favoris' });
  }
};

// Fonction pour ajouter un dossier aux favoris d'un utilisateur
exports.addFolderIdToFavorite = async (req, res) => {
  try {
    const userId = req.params.id || 'defaultId';
    const folder = req.body;
    
    // Cherche un utilisateur avec l'ID fourni et peuple les dossiers favoris
    const user = await User.findOne({ id: userId }).populate('FavoriteFolder');
    const folderId = folder.id;
    if (!user) {
      // Si l'utilisateur n'est pas trouvé, renvoie un statut 404
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifie si le dossier est déjà dans les favoris
    if (user.FavoriteFolder.find(f => typeof f === 'object' ? f.id === folderId : f === folderId)) {
      return res.status(400).json({ message: 'Le dossier est déjà dans les favoris' });
    }

    // Ajoute le dossier aux favoris
    console.log('Dossier à ajouter aux favoris:', folder);
    if (folder && folder.id) {
      user.FavoriteFolder.push(folder.id);
      await user.save();
      res.status(200).json({ message: 'Dossier ajouté aux favoris' });
    } else {
      res.status(400).json({ message: 'Dossier non valide' });
    }
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de l\'ajout du dossier aux favoris :', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du dossier aux favoris' });
  }
};

// Fonction pour retirer un dossier des favoris d'un utilisateur
exports.removeFolderIdFromFavorite = async (req, res) => {
  try {
    const userId = req.params.id || 'defaultId';
    const folderId = req.params.folderId;
    
    // Cherche un utilisateur avec l'ID fourni et peuple les dossiers favoris
    const user = await User.findOne({ id: userId }).populate('FavoriteFolder');
    if (!user) {
      // Si l'utilisateur n'est pas trouvé, renvoie un statut 404
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    console.log('Dossier à retirer des favoris:', user.FavoriteFolder);
    console.log('ID du dossier à retirer des favoris:', folderId);
    
    // Vérifie si le dossier est dans les favoris
    if (!user.FavoriteFolder.find(f => f === folderId)) {
      return res.status(400).json({ message: 'Le dossier n\'est pas dans les favoris' });
    }

    // Retire le dossier des favoris
    user.FavoriteFolder = user.FavoriteFolder.filter(f => f !== folderId);
    await user.save();

    // Renvoie un message de succès avec un statut 200
    res.status(200).json({ message: 'Dossier retiré des favoris' });
  } catch (error) {
    // Gère les erreurs et renvoie un statut 500
    console.error('Erreur lors de la suppression du dossier des favoris :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du dossier des favoris' });
  }
}