const express = require("express");
const router = express.Router();
const {
  getCollaborativeStories,
  createCollaborativeStory,
  inviteCollaborators,
  submitCollaborativePart,
} = require("../src/controllers/collaborativeStoryController");

/**
 * @openapi
 * /api/collaborative-stories:
 *   get:
 *     tags:
 *       - Collaborative Stories
 *     summary: Get all collaborative stories
 *     description: Retrieves all collaborative stories including details about the creator and contributors.
 *     responses:
 *       200:
 *         description: Successfully retrieved collaborative stories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CollaborativeStory'
 *       500:
 *         description: Server error when attempting to fetch collaborative stories.
 */
router.get("/", getCollaborativeStories);

/**
 * @openapi
 * /api/collaborative-stories:
 *   post:
 *     tags:
 *       - Collaborative Stories
 *     summary: Create a collaborative story
 *     description: Creates a new collaborative story by the authenticated user (must be a paid user).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the collaborative story
 *     responses:
 *       201:
 *         description: Successfully created the collaborative story.
 *       400:
 *         description: Data validation errors or missing mandatory fields.
 *       500:
 *         description: Server error when attempting to create a story.
 */
router.post("/", createCollaborativeStory);

/**
 * @openapi
 * /api/collaborative-stories/invite:
 *   post:
 *     tags:
 *       - Collaborative Stories
 *     summary: Invite collaborator
 *     description: Sends an invitation to a paid user to become a collaborator in a collaborative story.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storyID
 *               - email
 *             properties:
 *               storyID:
 *                 type: string
 *                 description: ID of the collaborative story to invite to.
 *               email:
 *                 type: string
 *                 description: Email of the user to invite as a collaborator.
 *     responses:
 *       200:
 *         description: Successfully invited the collaborator.
 *       400:
 *         description: Validation errors or incorrect input data.
 *       404:
 *         description: Collaborative story or user not found.
 *       403:
 *         description: User does not have a paid subscription.
 *       500:
 *         description: Server error when attempting to invite collaborator.
 */
router.post("/invite", inviteCollaborators);

/**
 * @openapi
 * /api/collaborative-stories/submit:
 *   post:
 *     tags:
 *       - Collaborative Stories
 *     summary: Submit part of a collaborative story
 *     description: Allows an invited user and contributor to submit their part of the collaborative story.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storyID
 *               - text
 *             properties:
 *               storyID:
 *                 type: string
 *                 description: ID of the collaborative story to contribute to.
 *               text:
 *                 type: string
 *                 description: Text content of the story part being submitted.
 *     responses:
 *       200:
 *         description: Successfully submitted story part.
 *       400:
 *         description: Validation errors or incorrect input data.
 *       404:
 *         description: Collaborative story not found.
 *       500:
 *         description: Server error when attempting to submit a story part.
 */
router.post("/submit", submitCollaborativePart);

module.exports = router;
