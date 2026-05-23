const express = require('express');
// Cart is managed on the frontend (localStorage) for simplicity.
// This route exists for future server-side cart persistence.
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Cart is managed client-side. Use localStorage.' });
});

module.exports = router;
