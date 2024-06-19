const FAQ = require('../src/models/faq');

async function getFAQ(req, res, next) {
  let faq;
  try {
    faq = await FAQ.findById(req.params.id);
    if (faq == null) {
      return res.status(404).json({ message: 'Cannot find FAQ' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.faq = faq;
  next();
}

module.exports = getFAQ;
