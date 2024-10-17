// controllers/userController.js
const User = require('../Models/User');
const { authenticateToken } = require('../Middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, school, city } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      school: school,
      city: city,
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
      const user = await User.findById(userId);
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
      const updatedUser = await User.findByIdAndUpdate(userId, updateObj, { new: true });

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
      const result = await User.deleteOne({ _id: userId });

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
      const token = jwt.sign({ userId: user.id, username: user.username }, 'TjPJIv2wnVUdflrb', { expiresIn: '1h' });
  
      res.status(200).json({ user, token });
    } catch (error) {
      console.error('Erreur lors de l\'authentification de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de l\'authentification de l\'utilisateur' });
    }
  };