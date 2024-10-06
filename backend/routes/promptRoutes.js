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
  getAllPromptsOfContest,
} = require("../src/controllers/promptController");
const getCachedData = require("../middleware/getCachedData");
const cacheTypes = require("../src/utils/types/cacheType");
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
 * @swagger
 * /api/prompts/practice-prompts:
 *   get:
 *     tags:
 *       - Prompts
 *     summary: Retrieve a list of practice prompts
 *     description: Retrieve a list of practice prompts with pagination options.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of items to return
 *     responses:
 *       200:
 *         description: A list of practice prompts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       // Add properties of your practice prompts here
 *                 pageData:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     perPage:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
router.get(
  "/practice-prompts",
  (req, res, next) => {
    getCachedData(`${cacheTypes.PRACTISE_PROMPTS}-${req.query.category}`, true);
    next();
  },
  getPracticePrompts
);

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
router.get(
  "/game-prompts",
  getCachedData(cacheTypes.GAME_PROMPT, true),
  getGamePrompts
);

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

router.get("/list/:contestId", getAllPromptsOfContest);

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
