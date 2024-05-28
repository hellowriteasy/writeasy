const { scoreStory } = require("../../src/controllers/StoryScoreController");
const { mockRequest, mockResponse } = require("../helpers");

describe("StoryScoreController", () => {
  test("should score a story correctly", async () => {
    const req = mockRequest({
      body: { storyText: "Once upon a time...", userId: "123" },
    });
    const res = mockResponse();

    await scoreStory(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Story scored successfully",
      })
    );
  });

  // Additional tests can include handling errors, invalid inputs, etc.
});
