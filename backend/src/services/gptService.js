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
  async getComparativeScores(stories, title) {
    let storyObj = {};
    stories.forEach((story) => {
      storyObj[story._id] = story.content;
    });

    try {
      const systemPrompt = `The title of the contest is ${title}. Evaluate the stories with each other and score each of them out of 10. Ensure that the decision is accurate, concise, and consistent across all comparisons. Only return the response in JSON format, nothing else.`;

      const prompt = `
You are given a set of stories. Each story is identified by a unique ID and has content associated with it.
Evaluate these stories against each other based on writing quality, grammar, and other relevant factors.
Score each story out of 10, aiming for high accuracy and consistency in your evaluation.
Return the results as a JSON object with story IDs as keys and scores as values.

Example Input:
{
  "124": "story content",
  "125": "story content",
  "126": "story content"
}

Example Expected Output:
{
  "124": 9,
  "125": 5,
  "126": 8
}

Now, here is the input:
${JSON.stringify(storyObj)}
`;

      const response = await axios.post(
        this.apiUrl,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          max_tokens: prompt.split(" ").length + 50,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      let result = response.data.choices[0].message.content;
      // Use regex to extract the JSON object from the result
      const jsonRegex = /{[\s\S]*?}/;
      const match = result.match(jsonRegex);

      if (match) {
        try {
          const parsedResult = JSON.parse(match[0]);
          return parsedResult;
        } catch (error) {
          console.error("API request error:", error);
        }
      }
    } catch (err) {
      console.log("error while comparing stories", err);
    }
  }

  async rankStories(stories, title) {
    let scores = [];

    for (let i = 0; i < stories.length - 1; i++) {
      let groupStories = this.groupStories(stories);
      const groupStoriesScores = await Promise.all(
        groupStories.map(async (group) => {
          const score = await this.getComparativeScores(group, title);
          return score;
        })
      );
      scores.push(...groupStoriesScores);
    }

    // Object to store aggregated scores
    let aggregatedScores = {};

    scores.forEach((score) => {
      Object.keys(score).forEach((storyId) => {
        if (aggregatedScores[storyId]) {
          aggregatedScores[storyId] += score[storyId];
        } else {
          aggregatedScores[storyId] = score[storyId];
        }
      });
    });

    aggregatedScores = this.getTop20Percent(aggregatedScores);

    return aggregatedScores;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  groupStories(stories) {
    const groupSize = 5;
    const totalStories = stories.length;
    const numGroups = Math.ceil(totalStories / groupSize);

    const shuffledStories = this.shuffleArray(stories);

    const groups = Array.from({ length: numGroups }, () => []);

    shuffledStories.forEach((story, index) => {
      groups[index % numGroups].push(story);
    });

    return groups;
  }
  getTop20Percent(stories) {
    // Convert the object into an array of [key, value] pairs
    const entries = Object.entries(stories);

    // Sort the array in descending order based on the values
    entries.sort((a, b) => b[1] - a[1]);

    // Calculate the number of entries that constitute the top 20%
    const top20Count = Math.ceil(entries.length * 0.2);

    // Get the top 20% entries
    const top20Entries = entries.slice(0, top20Count);

    // Convert the top 20% entries back to an object
    const top20PercentObject = Object.fromEntries(top20Entries);

    return top20PercentObject;
  }
}

module.exports = GptService;
