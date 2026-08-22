const express = require('express');
const router = express.Router();

const db = require('../config/db');
const systemController = require('../controllers/systemController');
const scanController = require('../controllers/scanController');
const recipeController = require('../controllers/recipeController');
const logController = require('../controllers/logController');
const userController = require('../controllers/userController');
const payController = require('../controllers/payController');

// System endpoints
router.get('/health', systemController.getHealth);
router.get('/config', systemController.getConfig);

// Gemini AI endpoints
router.get('/test-gemini', scanController.testGemini);
router.post('/scan', scanController.scanFood);
router.post('/coach/chat', scanController.chatCoach);

// Spoonacular & Favorite Recipe API Endpoints
router.get('/recipes/search', recipeController.searchRecipes);
router.get('/recipes/favorites/:userId', recipeController.getFavoriteRecipes);
router.post('/recipes/favorites/:userId', recipeController.saveFavoriteRecipe);

// Daily Logs (Requires DB)
router.get('/daily/:userId/:date', db.requireDb, logController.getDailyLog);
router.put('/daily/:userId/:date', db.requireDb, logController.updateDailyLog);

// Payment Checkout Gateway (No DB requirement check on GET to allow error states rendering, DB check on POST)
router.get('/pay', payController.getPayPage);
router.post('/pay/verify', db.requireDb, payController.verifyPayment);

// History (Requires DB)
router.get('/history/:userId', db.requireDb, logController.getHistory);

// User Management (Requires DB)
router.delete('/users/:userId', db.requireDb, userController.deleteUser);

module.exports = router;
