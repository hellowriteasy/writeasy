const Story = require("../../src/models/story");

async function deleteGameStories() {
  await Story.deleteMany({
    storyType: "game",
  });
}

module.exports = deleteGameStories