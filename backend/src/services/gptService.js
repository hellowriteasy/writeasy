const axios = require("axios");

class GptService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = "https://api.openai.com/v1/chat/completions";
  }

  // Updated to handle additional user requests with more detailed prompt
  async generateScore(storyText, taskType, wordCount, topic) {
    const systemMessage = {
      grammar: "Proofread this text but only fix grammar",
      rewrite: "Rewrite this text improving clarity and flow",
      improve: "Proofread this text improving clarity and flow",
    };

    const detailedPrompt = `
      The provided text should be evaluated and scored following a detailed rubric based on the criteria of content, organisation, and technical accuracy. The story's content and organisation should be compelling or clear (depending on the quality) and effectively matched to the intended audience and purpose with a suitable tone, style, and register. Particular attention should be paid to the vocabulary and linguistic devices used, as well as the structure and coherency of ideas presented through well-linked paragraphs.The title of the story is ${topic}. The total score is 100.


      If the content includes any inappropriate themes such as violence or explicit content, immediately assign a score of 0.

      Please provide the numerical score strictly in the first line based solely on this rubric. Additionally, You are a master proofreader. Only proofread the given text, don't add new text to the document. \n( ${
        taskType ? systemMessage[taskType] : ""
      }). \n Start this from the second line of your response. Once again, Please provide the numerical score strictly in the first line!!!
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
      console.log("score", score);
      console.log("correction", corrections);
      return { score, corrections };
    } catch (error) {
      console.error("Error in generating score from GPT:", error);
      throw new Error("Error interacting with GPT API.");
    }
  }

  async generateCorrectionSummary(originalText, corrections, score) {
    const prompt = `The user submitted the following story as his original writing \n. ${originalText} \n ${
      score ? `The text was scored ${score}.` : ""
    }  Here are the corrections that you made: \n ${corrections}. \n 
    You are a professional teacher. Provide a summary explaining why these corrections were needed and why the story received the given score based on content, organization, and technical accuracy. Provide the response as like you are instructing the student.`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: "gpt-4-turbo",
          messages: [{ role: "system", content: prompt }],
          max_tokens: 250,
          temperature: 0.3,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      const summary = response.data.choices[0].message.content.trim();
      return summary;
    } catch (error) {
      console.error("Error in generating correction summary from GPT:", error);
      throw new Error("Error interacting with GPT API for summary.");
    }
  }
  async generateScoreInChunk(storyText, taskType, wordCount, cb) {
    const systemMessage = {
      grammar: "Proofread this text but only fix grammar",
      rewrite:
        "Rewrite this text improving clarity and flow. You may also add new lines to make the writing better.",
      improve:
        "Proofread this text improving clarity and flow. Don't add new lines, just modify the text",
    };

    try {
      const totalTokens = Math.min(Math.ceil(wordCount * 1.5), 4096); // Ensure the token count doesn't exceed model limits
      console.log("total tokens", totalTokens);
      const response = await axios({
        method: "post",
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        data: {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a master proofreader. The instructions are often in English, but keep the proofread text in the same language as the language being asked to proofread.",
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
            if (jsonString.trim() === "[DONE]") {
              console.log("[DONE] received");
              return;
            }

            try {
              const jsonObject = JSON.parse(jsonString);
              const choices = jsonObject.choices;
              if (choices[0] && choices[0].delta?.content) {
                let data = choices[0].delta?.content;
                if (cb) {
                  cb(data, false);
                }
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        });
      });

      response.data.on("end", () => {
        // Handle the remaining buffer
        if (buffer.trim()) {
          try {
            const jsonString = buffer.startsWith("data: ")
              ? buffer.slice(6)
              : buffer;
            const jsonObject = JSON.parse(jsonString);
            const choices = jsonObject.choices;
            if (choices[0] && choices[0].delta?.content) {
              let data = choices[0].delta?.content;
              if (cb) {
                cb(data, false);
              }
            }
          } catch (error) {
            console.error("Error parsing final JSON:", error);
          }
        }
        console.log("Stream closed");
        cb(null, true);
      });
    } catch (error) {
      console.error("Error in generating score from GPT:", error);
      throw new Error("Error interacting with GPT API.");
    }
  }

  async generateCorrection(storyText, taskType, wordCount) {
    const systemMessage = {
      grammar: "Proofread this text but only fix grammar",
      rewrite: "Rewrite this text improving clarity and flow",
      improve: "Proofread this text improving clarity and flow",
    };

    try {
      const totalTokens = wordCount + 50;
      const response = await axios({
        method: "post",
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
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
        },
      });
      console.log("response", response);
      const data = response.data.choices[0].message.content;
      console.log("data", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async generateScoreForBulkWritings(writings) {
    const detailedPrompt = `Please evaluate each writing individually and provide a score based on the criteria of content, organization, and technical accuracy. The total score should be out of 100, with the following distribution:
  Content and Organization: 60 marks
  Depth and Detail (30 marks): Evaluate the richness of information, examples, and explanations provided. Minimal content should receive a lower score. A higher score is given for thorough and well-supported ideas.
  Relevance to Topic (15 marks): Assess how well the text stays on topic and addresses the subject matter. Texts that are off-topic or only vaguely related should receive a lower score.
  Audience and Purpose (10 marks): Evaluate how effectively the text addresses its intended audience and fulfills its purpose. Clear alignment with the audience's needs and the purpose of the writing scores higher.
  Coherence and Structure (5 marks): Evaluate the logical flow and clear structure of ideas. Well-organized writing with clear paragraphing and transitions scores higher.
  Technical Accuracy: 40 marks
  Grammar and Spelling (20 marks): Assess the correctness of grammar, spelling, and punctuation. Fewer errors result in a higher score.
  Sentence Structure and Syntax (20 marks): Evaluate the complexity and variety of sentence structures, as well as adherence to standard writing conventions.
  The input will be an array of objects in the following json format: writings=[{ userId:'here should be user's id from the input', writing:'...'}  and so on]
  For each writing, generate a score based on the above criteria and return an array of objects in the following format:[{ userId:'2345', score: 55 }, { userId:'9876', score: 88 }]
  The response should consist only of the array of objects with userId and score, nothing else.`;

    console.log("the prompt ", writings);

    const processWritingChunks = async (writingChunks) => {
      const totalTokens = writingChunks.length + 50;
      try {
        const response = await axios.post(
          this.apiUrl,
          {
            model: "gpt-4-turbo",
            messages: [
              { role: "system", content: detailedPrompt },
              {
                role: "user",
                content: `Here are the writings of the writers: ${JSON.stringify(
                  writingChunks
                )}`,
              },
            ],
            max_tokens: totalTokens,
            temperature: 0.5, // Adjusted for more controlled responses
            stream: true, // Enable streaming
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            responseType: "stream",
          }
        );

        return new Promise((resolve, reject) => {
          let data = "";
          response.data.on("data", (chunk) => {
            console.log("incomingg data", chunk.toString());
            data += chunk.toString("utf8");
          });

          response.data.on("end", () => {
            try {
              console.log("end", data);
              const results = JSON.parse(data);
              resolve(results);
            } catch (error) {
              reject(new Error("Error parsing the streamed response."));
            }
          });

          response.data.on("error", (error) => {
            reject(new Error("Error in streaming response: " + error.message));
          });
        });
      } catch (error) {
        console.error("Error in generating score from GPT:", error);
        throw new Error("Error interacting with GPT API.");
      }
    };

    // Divide writings into smaller chunks if necessary
    const chunkSize = 5; // Adjust chunk size as needed
    const writingChunks = [];
    for (let i = 0; i < writings.length; i += chunkSize) {
      writingChunks.push(writings.slice(i, i + chunkSize));
    }

    const allResults = [];
    for (const chunk of writingChunks) {
      const chunkResults = await processWritingChunks(chunk);
      allResults.push(...chunkResults);
    }

    return allResults;
  }
}

module.exports = GptService;
