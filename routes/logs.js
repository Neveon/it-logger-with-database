const express = require('express');
const router = express.Router();

const Log = require('../models/Log');

// @route   GET api/logs
// @desc    Get all logs or searched logs
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check for query
    let query = req.query.q;
    if (!query) {
      //Sort by most recent log
      const logs = await Log.find().sort({
        date: -1
      });
      res.json(logs);
    } else {
      let regExp = new RegExp(query, 'i'); // Used to manually filter logs.tech and logs.messages
      // find by tech
      const techLogsMatch = await Log.find({
        tech: { $regex: regExp }
      }).sort({
        date: -1
      });
      // find by message
      const messagesLogsMatch = await Log.find({
        message: { $regex: regExp }
      }).sort({
        date: -1
      });

      let newLogs = []; // Init new logs
      // Loop through techLogsMatch (if theres a match)
      // and if obj (from techLogsMatch) does *NOT*
      // match object found in messagesLogs, push to newLogs
      if (techLogsMatch.length > 0) {
        for (let obj in techLogsMatch) {
          newLogs.push(techLogsMatch[obj]);
          for (let object in messagesLogsMatch)
            if (obj.tech !== object.tech && obj.message !== object.message) {
              newLogs.push(messagesLogsMatch[object]);
            }
        }
        res.json(newLogs);
      } else {
        // If no tech match then return any messages match
        res.json(messagesLogsMatch);
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/logs
// @desc    Add a new log
// @access  Public (anyone can add a log)
router.post('/', async (req, res) => {
  // req.body
  const { tech, message, attention } = req.body;

  try {
    // Creating a new log
    let log = new Log({
      tech,
      message,
      attention
    }); // default creates date

    const newLog = await log.save();

    res.json(newLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/logs/:id
// @desc    Update log
// @access  Public
router.put('/:id', async (req, res) => {
  const { tech, message, attention } = req.body;

  // Build log object
  const logField = { date: Date.now() }; // Update date in new log to now
  if (tech) logField.tech = tech;
  if (message) logField.message = message;
  if (attention) logField.attention = attention;

  try {
    let log = await Log.findById(req.params.id);
    // Check if log exists, otherwise return error
    if (!log) return res.status(404).json({ msg: 'Log not found' });

    log = await Log.findByIdAndUpdate(
      req.params.id,
      { $set: logField },
      { new: true } // This returns new updated doc rather than the old doc
    );

    res.json(log); // Send updated contact
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/logs/:id
// @desc    Delete log
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    let log = await Log.findById(req.params.id);

    if (!log) return res.status(404).json({ msg: 'Log not found' });

    await Log.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Log removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
