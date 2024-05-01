const axios = require("axios");

class GptService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = "https://api.openai.com/v1/chat/completions";
  }

  async generateScore(storyText) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content:
                "You'll evaluate the writing provided by a user and assign a numerical score based solely on its quality. The score should range from 0 to 100, where 100 signifies a perfect story without any need for improvement, and 0 indicates a story that lacks fundamental qualities required for a coherent and engaging narrative. Please ensure your response consists only of a number representing the score, devoid of any additional commentary or explanation. This task requires an objective assessment based directly on the narrative quality of the submitted writing.",
            },
            { role: "user", content: storyText },
          ],
          max_tokens: 3,
          temperature: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error in generating score from GPT:", error);
      throw new Error("Error interacting with GPT API.");
    }
  }
}

module.exports = GptService;
