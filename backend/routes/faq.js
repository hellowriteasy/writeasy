const express = require('express');
const router = express.Router();
const FAQ = require('../src/models/faq');
const getFAQ = require('../middleware/faqMiddleware');

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ place: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one FAQ
router.get('/:id', getFAQ, (req, res) => {
  res.json(res.faq);
});

// Create new FAQ
router.post('/', async (req, res) => {
  const faq = new FAQ({
    question: req.body.question,
    answer: req.body.answer,
    place: req.body.place
  });

  try {
    const newFAQ = await faq.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update FAQ
router.put('/:id', getFAQ, async (req, res) => {
  if (req.body.question != null) {
    res.faq.question = req.body.question;
  }
  if (req.body.answer != null) {
    res.faq.answer = req.body.answer;
  }
  if (req.body.place != null) {
    res.faq.place = req.body.place;
  }

  try {
    const updatedFAQ = await res.faq.save();
    res.json(updatedFAQ);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete FAQ
router.delete('/:id', getFAQ, async (req, res) => {
  try {
    await res.faq.deleteOne();
    res.json({ message: 'Deleted FAQ' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
