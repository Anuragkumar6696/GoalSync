const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
} = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
  validate,
  loginSchema,
  registerSchema,
} = require('../middleware/validationMiddleware');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
