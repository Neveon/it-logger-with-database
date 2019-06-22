const express = require('express');
const router = express.Router();

const Tech = require('../models/Tech');

// @route   GET api/techs
// @desc    Get all techs
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Sort by most recent techs added first
    const techs = await Tech.find().sort({
      date: -1
    });
    res.json(techs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/techs
// @desc    Add a new tech
// @access  Public (anyone can add a tech)
router.post('/', async (req, res) => {
  // req.body
  const { firstName, lastName, date } = req.body;

  try {
    // Check for tech w that name
    let tech = await Tech.findOne({ firstName, lastName }); // {name: name}

    if (tech) {
      return res.status(400).json({ msg: 'Tech already exists' });
    } else {
      // Creating new tech
      tech = new Tech({
        firstName,
        lastName,
        date
      });

      const newTech = await tech.save();

      res.json(newTech);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/techs/:id
// @desc    Delete tech
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    let tech = await Tech.findById(req.params.id);

    if (!tech) return res.status(404).json({ msg: 'Technician not found' });

    await Tech.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Technician removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
