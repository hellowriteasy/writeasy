const axios = require("axios");

class GptService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = "https://api.openai.com/v1/chat/completions";
  }

  // Updated to handle additional user requests with more detailed prompt
  async generateScore(storyText, taskType, wordCount) {
    const systemMessage = {
      grammar: "Proofread this text but only fix grammar",
      rewrite: "Rewrite this text improving clarity and flow",
      improve: "Proofread this text improving clarity and flow",
    };

    const detailedPrompt = `
      The provided text should be evaluated and scored following a detailed rubric based on the criteria of content, organisation, and technical accuracy. The story's content and organisation should be compelling or clear (depending on the quality) and effectively matched to the intended audience and purpose with a suitable tone, style, and register. Particular attention should be paid to the vocabulary and linguistic devices used, as well as the structure and coherency of ideas presented through well-linked paragraphs.

      If the content includes any inappropriate themes such as violence or explicit content, immediately assign a score of -10.

      Please provide the numerical score strictly in the first line based solely on this rubric. Additionally, You are a master proofreader. Only proofread the given text, don't add new text to the document.(${systemMessage[taskType]}). Start this from the second line of your response.
    `;

    try {
      const totalTokens = wordCount + 50;
      const response = await axios.post(
        this.apiUrl,
        {
          model: "gpt-4-turbo",
          messages: [
            { role: "system", content: detailedPrompt },
            { role: "user", content: storyText },
          ],
          max_tokens: totalTokens,
          temperature: 0.5, // Adjusted for more controlled responses
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      // Extract only the numeric score from the first line and any subsequent corrections from the rest
      const fullMessage = response.data.choices[0].message.content;
      const splitMessage = fullMessage.split("\n");
      const score = parseInt(splitMessage[0].trim(), 10); // Ensuring the score is an integer
      const corrections = splitMessage.slice(1).join("\n").trim();

      return { score, corrections };
    } catch (error) {
      console.error("Error in generating score from GPT:", error);
      throw new Error("Error interacting with GPT API.");
    }
  }
}

module.exports = GptService;
