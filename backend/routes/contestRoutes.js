const express = require("express");
const router = express.Router();
const {
  createContest,
  getContests,
  updateContest,
  deleteContest,
  getContest,
  getOngoingContests,
  getEndedContests,
} = require("../src/controllers/contestController");
const getCahcedData = require("../middleware/getCachedData");
const cacheTypes = require("../src/utils/types/cacheType");
/**
 * @openapi
 * /api/contests:
 *   post:
 *     tags:
 *       - Contests
 *     summary: Create a contest
 *     description: Creates a new contest with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contest'
 *     responses:
 *       201:
 *         description: Contest created successfully.
 *       500:
 *         description: Server error when attempting to create a contest.
 */
router.post("/", createContest);

/**
 * @openapi
 * /api/contests:
 *   get:
 *     tags:
 *       - Contests
 *     summary: Get all contests
 *     description: Retrieves all contests, including their associated prompts.
 *     responses:
 *       200:
 *         description: Successfully retrieved all contests.
 *       500:
 *         description: Server error when fetching contests.
 */
router.get("/", getContests);

/**
 * @openapi
 * /api/contests/ongoing:
 *   get:
 *     tags:
 *       - Contests
 *     summary: Get ongoing contests
 *     description: Retrieves all ongoing contests that have not reached their submission deadline.
 *     responses:
 *       200:
 *         description: Successfully retrieved ongoing contests.
 *       500:
 *         description: Server error when fetching ongoing contests.
 */
router.get(
  "/ongoing",
  getCahcedData(cacheTypes.ONGOING_CONTEST),
  getOngoingContests
);

/**
 * @openapi
 * /api/contests/ended:
 *   get:
 *     tags:
 *       - Contests
 *     summary: Get ended contests
 *     description: Retrieves all ongoing contests that have not reached their submission deadline.
 *     responses:
 *       200:
 *         description: Successfully retrieved ongoing contests.
 *       500:
 *         description: Server error when fetching ongoing contests.
 */
router.get("/ended", getCahcedData(cacheTypes.ENDED_CONTEST), getEndedContests);

/**
 * @openapi
 * /api/contests/{id}:
 *   get:
 *     tags:
 *       - Contests
 *     summary: Get a contest by ID
 *     description: Retrieves details of a contest by its ID, including its associated prompts.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contest to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the contest.
 *       404:
 *         description: Contest not found.
 *       500:
 *         description: Server error when attempting to fetch the contest.
 */
router.get("/:id", getContest);

/**
 * @openapi
 * /api/contests/{id}:
 *   put:
 *     tags:
 *       - Contests
 *     summary: Update a contest
 *     description: Updates an existing contest identified by its ID with new details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contest to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contest'
 *     responses:
 *       200:
 *         description: Contest updated successfully.
 *       404:
 *         description: Contest not found.
 *       500:
 *         description: Server error when attempting to update the contest.
 */
router.put("/:id", updateContest);

/**
 * @openapi
 * /api/contests/{id}:
 *   delete:
 *     tags:
 *       - Contests
 *     summary: Delete a contest
 *     description: Deletes a contest identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the contest to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Contest deleted successfully.
 *       404:
 *         description: Contest not found.
 *       500:
 *         description: Server error when attempting to delete the contest.
 */
router.delete("/:id", deleteContest);

module.exports = router;
