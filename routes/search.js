const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// Smart Search Route
router.get('/:key', async (req, res) => {
  const rawKey = req.params.key.toLowerCase();
  let location = '';
  let minPrice, maxPrice;

  const underMatch = rawKey.match(/under (\d+)/);
  const betweenMatch = rawKey.match(/between (\d+)\s*and\s*(\d+)/);
  const inMatch = rawKey.match(/in ([a-zA-Z\s]+)/);

  if (underMatch) {
    maxPrice = parseInt(underMatch[1]);
  }
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1]);
    maxPrice = parseInt(betweenMatch[2]);
  }
  if (inMatch) {
    location = inMatch[1].trim();
  }

  // Fallback if city not matched explicitly
  const knownCities = ['jaipur', 'delhi', 'pune', 'udaipur', 'mumbai'];
  for (const city of knownCities) {
    if (rawKey.includes(city)) {
      location = city;
      break;
    }
  }

  if (!location) {
    location = rawKey;
  }

  // Final filter
  let filter = {
    $or: [
      { location: { $regex: new RegExp(location, 'i') } },
      { title: { $regex: new RegExp(rawKey, 'i') } },
      { description: { $regex: new RegExp(rawKey, 'i') } }
    ]
  };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  try {
    const allListings = await Listing.find(filter);
    res.render("listings/search", { allListings });
  } catch (err) {
    console.error(err);
    res.status(500).send('Search error');
  }
});

module.exports = router;
