const { default: axios } = require("axios");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { storyText, taskType } = req.body;
  const wordCount = storyText.split(" ").length;

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
        Authorization: `Bearer sk-proj-Dt2El0drg7WRw5kZGLhCT3BlbkFJE3B9RfWIhwzTPS6r7eHJ`,
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

    let buffer = "";

    response.data.on("data", (chunk) => {
      const chunkString = chunk.toString();

      // Accumulate the incoming chunks
      buffer += chunkString;

      // Split the buffer into potential complete JSON strings
      const parts = buffer.split("\n\n");

      // Process each part
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // The last part might be incomplete, so keep it in the buffer
          buffer = part;
        } else {
          // Remove the 'data: ' prefix if it exists
          const jsonString = part.startsWith("data: ") ? part.slice(6) : part;

          // Check if the string is a valid JSON string
          if (jsonString.trim() === "[DONE]") {
            console.log("[DONE] received");
            return;
          }

          try {
            // Parse the JSON string into an object
            const jsonObject = JSON.parse(jsonString);
            // Access the 'choices' property
            const choices = jsonObject.choices;
            // Log the choices to the console
            console.log(choices);
            if (choices[0] && choices[0].delta?.content) {
              let data = choices[0].delta?.content;
              res.write(`${data}`);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      });
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
