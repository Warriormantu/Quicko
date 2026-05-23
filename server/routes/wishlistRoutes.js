const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');

router.use(protect);
router.get('/', getWishlist);
router.post('/:productId', toggleWishlist);

module.exports = router;
