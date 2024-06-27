const router = require("express").Router();

router.post("/", async (req, res) => {
  const { storyText, taskType, wordCount } = req.body;

  const systemMessage = {
    grammar: "Proofread this text but only fix grammar",
    rewrite: "Rewrite this text improving clarity and flow",
    improve: "Proofread this text improving clarity and flow",
  };

  const totalTokens = wordCount + 50;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const response = await axios({
      method: "post",
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.GPT_API_KEY}`,
      },
      data: {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a master proofreader. Only proofread the given text, don't add new text to the document. The instructions are often in English, but keep the proofread text in the same language as the language being asked to proofread.",
          },
          {
            role: "user",
            content: `${systemMessage[taskType]}:\n\n${storyText}`,
          },
        ],
        max_tokens: totalTokens,
        temperature: 0.5,
        stream: true, // Enable streaming
      },
      responseType: "stream",
    });

    response.data.on("data", (chunk) => {
      const chunkString = chunk.toString();
      res.write(`data: ${chunkString}\n\n`);
    });

    response.data.on("end", () => {
      res.write("event: end\n\n");
      res.end();
    });
  } catch (error) {
    console.error("Error in generating score from GPT:", error);
    res.status(500).send("Error interacting with GPT API.");
  }
});
module.exports = router;
