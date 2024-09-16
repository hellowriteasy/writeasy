const express = require("express");
const router = express.Router();
const FAQ = require("../src/models/faq");
const getFAQ = require("../middleware/faqMiddleware");

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ place: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one FAQ
router.get("/:id", getFAQ, (req, res) => {
  res.json(res.faq);
});

// Create new FAQ
router.post("/", async (req, res) => {
  const { question, answer, place } = req.body;

  try {
    // Get the total number of FAQs to determine the next available place
    const faqCount = await FAQ.countDocuments();

    // Determine the appropriate place for the new FAQ
    let newPlace = place;

    // If place is not provided or is greater than the count, set it to the next available position
    if (!newPlace || newPlace > faqCount + 1) {
      newPlace = faqCount + 1;
    }

    // If the new place is within the range of existing FAQs
    if (newPlace <= faqCount) {
      // Shift all FAQs from the new place onwards down by 1
      await FAQ.updateMany(
        { place: { $gte: newPlace } },
        { $inc: { place: 1 } }
      );
    }

    // Create the new FAQ with the adjusted place
    const faq = new FAQ({
      question,
      answer,
      place: newPlace,
    });

    const newFAQ = await faq.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware to get the FAQ by ID

// PUT route to update FAQ
router.put("/:id", async (req, res) => {
  const { question, answer, place } = req.body;

  try {
    // Find the FAQ by ID
    const faqToUpdate = await FAQ.findById(req.params.id);
    const currentPlace = faqToUpdate.place;

    if (place != null) {
      // If moving to a higher position
      if (place > currentPlace) {
        // Increment the position of FAQs currently between currentPlace + 1 and place
        await FAQ.updateMany(
          {
            place: { $gt: currentPlace, $lte: place },
          },
          { $inc: { place: -1 } }
        );
      }

      // If moving to a lower position
      if (place < currentPlace) {
        // Decrement the position of FAQs currently between place and currentPlace - 1
        await FAQ.updateMany(
          {
            place: { $gte: place, $lt: currentPlace },
          },
          { $inc: { place: 1 } }
        );
      }

      // Update the FAQ's place to the new place
      faqToUpdate.place = place;
    }

    // Update other fields if provided
    if (question != null) {
      faqToUpdate.question = question;
    }
    if (answer != null) {
      faqToUpdate.answer = answer;
    }

    const updatedFAQ = await faqToUpdate.save();
    res.json(updatedFAQ);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Delete FAQ
router.delete("/:id", getFAQ, async (req, res) => {
  try {
    await res.faq.deleteOne();
    res.json({ message: "Deleted FAQ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
