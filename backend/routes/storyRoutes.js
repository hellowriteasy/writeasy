const express = require("express");
const router = express.Router();
const {
  createStory,
  getStories,
  updateStory,
  deleteStory,
  getStory,
  getTopContestStories,
  getStoriesByUserAndType,
  getTopStoriesByPrompt,
  getStoryOfAuserByPrompt,
  getStoriesByContentAndPrompt,
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
 * /api/stories/user:
 *   get:
 *     tags:
 *       - Stories
 *     summary: Get stories by userId and storyType
 *     description: Retrieves stories for a specific user and story type.
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *       - name: storyType
 *         in: query
 *         required: true
 *         description: The type of the story (practice, contest, game)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved stories.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Error occurred while fetching the stories.
 */
router.get("/user", getStoriesByUserAndType);

/**
 * @openapi
 * /api/stories/top:
 *   get:
 *     tags:
 *       - Stories
 *     summary: Get top 20% contest stories
 *     description: Retrieves top 20% stories of type 'contest' sorted by score.
 *     responses:
 *       200:
 *         description: Successfully retrieved top stories.
 *       500:
 *         description: Error occurred while fetching the stories.
 */
router.get("/top", getTopContestStories);

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
 * /api/stories/user/{prompt_id}/{user_id}:
 *   get:
 *     summary: Get the story of a user by prompt ID and user ID
 *     description: Retrieves the story content associated with a specific user and prompt.
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: prompt_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the prompt.
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Successful response. Story data returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prompt_id:
 *                   type: string
 *                   example: "prompt123"
 *                   description: The ID of the prompt.
 *                 user_id:
 *                   type: string
 *                   example: "user456"
 *                   description: The ID of the user.
 *                 story:
 *                   type: string
 *                   example: "Once upon a time..."
 *                   description: The story content related to the user and prompt.
 *       '404':
 *         description: Not Found. The requested user or prompt was not found.
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
 */
router.get("/user/:prompt_id/:user_id", getStoryOfAuserByPrompt);

/**
 * @swagger
 * /api/stories/contest/prompt:
 *   get:
 *     summary: Retrieve stories filtered by contest ID and/or prompt ID
 *     tags: [Stories]
 *     parameters:
 *       - in: query
 *         name: prompt_id
 *         schema:
 *           type: string
 *         description: Optional. Filter stories by prompt ID.
 *       - in: query
 *         name: contest_id
 *         schema:
 *           type: string
 *         description: Optional. Filter stories by contest ID.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Optional. The page number of results to retrieve.
 *       - in: query
 *         name: sortKey
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - score
 *         description: Optional. Sort by the sort key.
 *         required: false
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Optional. Number of stories per page.
 *     responses:
 *       200:
 *         description: A list of stories that match the query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Story'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */

router.get("/contest/prompt", getStoriesByContentAndPrompt);

module.exports = router;
