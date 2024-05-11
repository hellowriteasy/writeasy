const express = require("express");
const router = express.Router();
const {
  createPracticePrompt,
  createContestPrompt,
  getPracticePrompts,
  getContestPrompts,
  getPrompt,
  updatePrompt,
  deletePrompt,
} = require("../src/controllers/promptController");

/**
 * @openapi
 * /api/prompts/practice-prompt:
 *   post:
 *     tags:
 *       - Prompts
 *     summary: Create a practice prompt
 *     description: Creates a new practice prompt with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prompt'
 *     responses:
 *       201:
 *         description: Practice prompt created successfully.
 *       500:
 *         description: Server error when attempting to create a prompt.
 */
router.post("/practice-prompt", createPracticePrompt);

/**
 * @openapi
 * /api/prompts/contest-prompt:
 *   post:
 *     tags:
 *       - Prompts
 *     summary: Create a contest prompt
 *     description: Creates a new contest prompt with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prompt'
 *     responses:
 *       201:
 *         description: Contest prompt created successfully.
 *       500:
 *         description: Server error when attempting to create a prompt.
 */
router.post("/contest-prompt", createContestPrompt);

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

module.exports = router;
