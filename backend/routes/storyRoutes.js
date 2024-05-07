const express = require("express");
const router = express.Router();
const {
  createStory,
  getStories,
  updateStory,
  deleteStory,
  getStory,
  submitStoryToContest,
} = require("../src/controllers/storyController");
const { scoreStory } = require("../src/controllers/StoryScoreController");

/**
 * @openapi
 * /api/stories:
 *   post:
 *     tags:
 *       - Stories
 *     summary: Create a story
 *     description: Creates a new story entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Story'
 *     responses:
 *       201:
 *         description: Story created successfully.
 *       500:
 *         description: Error occurred while creating the story.
 */
router.post("/", createStory);

/**
 * @openapi
 * /api/stories:
 *   get:
 *     tags:
 *       - Stories
 *     summary: Get all stories
 *     description: Retrieves all stories created.
 *     responses:
 *       200:
 *         description: Successfully retrieved all stories.
 *       500:
 *         description: Error occurred while fetching the stories.
 */
router.get("/", getStories);

/**
 * @openapi
 * /api/stories/{id}:
 *   get:
 *     tags:
 *       - Stories
 *     summary: Get a specific story
 *     description: Retrieves a specific story by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the story to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the story.
 *       404:
 *         description: Story not found.
 *       500:
 *         description: Error occurred while fetching the story.
 */
router.get("/:id", getStory);

/**
 * @openapi
 * /api/stories/{id}:
 *   put:
 *     tags:
 *       - Stories
 *     summary: Update a story
 *     description: Updates an existing story entry by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the story to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Story'
 *     responses:
 *       200:
 *         description: Story updated successfully.
 *       500:
 *         description: Error occurred while updating the story.
 */
router.put("/:id", updateStory);

/**
 * @openapi
 * /api/stories/{id}:
 *   delete:
 *     tags:
 *       - Stories
 *     summary: Delete a story
 *     description: Deletes a specific story by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the story to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Story deleted successfully.
 *       500:
 *         description: Error occurred while deleting the story.
 */
router.delete("/:id", deleteStory);

/**
 * @openapi
 * /api/stories/score:
 *   post:
 *     tags:
 *       - Stories
 *     summary: Score a story and get corrections
 *     description: Submits a story for scoring and correction based on specified task type (grammar, rewrite, or improve).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, title, content, wordCount, taskType]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user who is submitting the story.
 *               title:
 *                 type: string
 *                 description: Title of the story.
 *               content:
 *                 type: string
 *                 description: Content of the story to be scored and optionally corrected.
 *               wordCount:
 *                 type: number
 *                 description: Word count of the story.
 *               taskType:
 *                 type: string
 *                 description: The type of task to perform on the story (ScoreOnly, Grammar, Rewrite, Improve).
 *                 enum: ["grammar", "rewrite", "improve"]
 *               storyType:
 *                 type: string
 *                 description: The type of the story
 *                 enum: ["practiceStory", "contestStory"]
 *               prompt:
 *                 type: string
 *                 description: ID of the prompt associated with the story.
 *     responses:
 *       201:
 *         description: Story scored and, if requested, corrected successfully.
 *       400:
 *         description: Invalid request parameters.
 *       500:
 *         description: Error occurred while processing the story.
 */
router.post("/score", scoreStory);

/**
 * @openapi
 * /api/stories/contest/{contestId}/prompt/{promptId}:
 *   post:
 *     tags:
 *       - Stories
 *       - Contests
 *     summary: Submit a story to a contest
 *     description: Submits a story to a specific contest tied to a prompt.
 *     parameters:
 *      - in: path
 *        name: contestId
 *        required: true
 *        description: ID of the contest.
 *        schema:
 *          type: string
 *      - in: path
 *        name: promptId
 *        required: true
 *        description: ID of the prompt associated with the contest.
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, title, content, wordCount]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user who is submitting the story.
 *               title:
 *                 type: string
 *                 description: Title of the story.
 *               content:
 *                 type: string
 *                 description: Content of the story.
 *               wordCount:
 *                 type: number
 *                 description: Word count of the story.
 *     responses:
 *       201:
 *         description: Story submitted to the contest successfully.
 *       400:
 *         description: Validation error related to prompt or contest linkage.
 *       404:
 *         description: Contest or prompt not found.
 *       500:
 *         description: Error occurred while submitting the story to the contest.
 */
router.post("/contest/:contestId/prompt/:promptId", submitStoryToContest);

module.exports = router;
