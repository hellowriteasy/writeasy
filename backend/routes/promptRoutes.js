const express = require("express");
const router = express.Router();
const {
  createPrompt,
  getPracticePrompts,
  getContestPrompts,
  getGamePrompts, // Add this to imports
  getPrompt,
  updatePrompt,
  deletePrompt,
  getPromptsByContestId,
  getAllPromptsOfContest
} = require("../src/controllers/promptController");

/**
 * @openapi
 * /api/prompts:
 *   post:
 *     tags:
 *       - Prompts
 *     summary: Create a prompt
 *     description: Creates a new prompt with the specified details. promptType can be either "practice", or "contest", "game"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prompt'
 *     responses:
 *       201:
 *         description: Prompt created successfully.
 *       500:
 *         description: Server error when attempting to create a prompt.
 */
router.post("/", createPrompt);

/**
 * @openapi
 * /api/prompts/practice-prompts:
 *   get:
 *     tags:
 *       - Prompts
 *     summary: Get all practice prompts
 *     description: Retrieves all practice prompts.
 *     responses:
 *       200:
 *         description: Successfully retrieved all practice prompts.
 *       500:
 *         description: Server error when fetching prompts.
 */
router.get("/practice-prompts", getPracticePrompts);

/**
 * @openapi
 * /api/prompts/contest-prompts:
 *   get:
 *     tags:
 *       - Prompts
 *     summary: Get all contest prompts
 *     description: Retrieves all contest prompts.
 *     responses:
 *       200:
 *         description: Successfully retrieved all contest prompts.
 *       500:
 *         description: Server error when fetching prompts.
 */
router.get("/contest-prompts", getContestPrompts);

/**
 * @openapi
 * /api/prompts/game-prompts:
 *   get:
 *     tags:
 *       - Prompts
 *     summary: Get all game prompts
 *     description: Retrieves all game prompts.
 *     responses:
 *       200:
 *         description: Successfully retrieved all game prompts.
 *       500:
 *         description: Server error when fetching prompts.
 */
router.get("/game-prompts", getGamePrompts);

/**
 * @openapi
 * /api/prompts/{id}:
 *   get:
 *     tags:
 *       - Prompts
 *     summary: Get a prompt by ID
 *     description: Retrieves details of a prompt by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the prompt to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the prompt.
 *       404:
 *         description: Prompt not found.
 *       500:
 *         description: Server error when attempting to fetch the prompt.
 */
router.get("/:id", getPrompt);

/**
 * @openapi
 * /api/prompts/{id}:
 *   put:
 *     tags:
 *       - Prompts
 *     summary: Update a prompt
 *     description: Updates an existing prompt identified by its ID with new details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the prompt to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prompt'
 *     responses:
 *       200:
 *         description: Prompt updated successfully.
 *       404:
 *         description: Prompt not found.
 *       500:
 *         description: Server error when attempting to update the prompt.
 */
router.put("/:id", updatePrompt);

/**
 * @openapi
 * /api/prompts/{id}:
 *   delete:
 *     tags:
 *       - Prompts
 *     summary: Delete a prompt
 *     description: Deletes a prompt identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the prompt to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Prompt deleted successfully.
 *       404:
 *         description: Prompt not found.
 *       500:
 *         description: Server error when attempting to delete the prompt.
 */
router.delete("/:id", deletePrompt);

/**
 * @openapi
 * /api/prompts/contest/{contestId}:
 *   get:
 *     tags:
 *       - Prompts
 *     summary: Get all prompts for a contest
 *     description: Retrieves all prompts for a specific contest by contest ID.
 *     parameters:
 *       - in: path
 *         name: contestId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contest.
 *     responses:
 *       200:
 *         description: Successfully retrieved the contest prompts.
 *       404:
 *         description: Contest not found.
 *       500:
 *         description: Server error when fetching contest prompts.
 */
router.get("/contest/:contestId", getPromptsByContestId);



router.get("/list/:contestId", getAllPromptsOfContest)




/**
 * @openapi
 * /api/prompts/user/{userId}/{promptId}:
 *   get:
 *     tags:
 *       - Prompts
 *     summary: Get all prompts for a contest
 *     description: Retrieves all prompts for a specific contest by contest ID.
 *     parameters:
 *       - in: path
 *         name: contestId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the contest.
 *     responses:
 *       200:
 *         description: Successfully retrieved the contest prompts.
 *       404:
 *         description: Contest not found.
 *       500:
 *         description: Server error when fetching contest prompts.
 */
// router.get("/user/:contestId", getPromptsByContestId);




module.exports = router;