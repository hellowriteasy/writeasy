const axios = require("axios");
const fs = require("fs");
const path = require("path");
const emailServiceClass = require("../services/emailService");

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
        "Rewrite this text improving clarity and flow. You may also add new lines to make the writing better.Grammer and spelling mistakes should be corrected.",
      improve:
        "Proofread this text improving clarity and flow. Don't add new lines, just modify the text",
    };

    try {
      const totalTokens = Math.min(Math.ceil(wordCount * 2), 4096); // Ensure the token count doesn't exceed model limits
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
                "You are a master proofreader. The instructions are often in English, but keep the proofread text in the same language as the language being asked to proofread. \n  No matter how small the input is you should do the work as ordered.",
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
        console.log("Received chunk:", chunkString);
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
      const systemPrompt = `You are tasked with evaluating stories submitted for the contest titled "${title}". Score each story out of 100 based on key writing criteria. Your decisions must be thorough, accurate, concise, and consistent across all stories. Provide the final output strictly in JSON format. Ensure that the number of stories in the output matches the number of stories in the input exactly (no_of_input_stories === no_of_output_stories). If any story has less than 250 words, reduce its score significantly.
`;

      const prompt = `You have been given a set of stories, each identified by a unique ID and associated with its content. Your goal is to evaluate these stories based on the following criteria, and compare each story with the others in the set:

          1. **Writing Quality**: How engaging, creative, and clear is the writing? Does it capture the reader’s attention and maintain interest throughout?
          2. **Grammar and Syntax**: Evaluate the correctness of grammar, punctuation, and sentence structure. Are there any major errors that detract from the reading experience?
          3. **Story Structure**: How well-organized is the story? Does it have a coherent flow with a clear beginning, middle, and end?
          4. **Conciseness**: Is the story concise and to the point without unnecessary details? Does it use appropriate summarization techniques where relevant?
          5. **Overall Impact**: How effective is the story in delivering its intended message or theme? Does it leave a lasting impression on the reader?

          ### Important Instructions:
          - **Comparative Evaluation**: Score each story by comparing it to the others in the set. Each story's score should reflect its relative quality within the set.
          - **Consistent Scoring**: Ensure that your scoring is consistent and fair across all stories.
          - **Output Requirement**: Return the scores as a JSON object with story IDs as keys and the respective scores (out of 100) as values.
          - **Match Input and Output Count**: The number of stories in the output must be exactly the same as the number of stories in the input. This means no story should be missing from the output. Check and confirm that the input count equals the output count (no_of_input_stories === no_of_output_stories).
          - **Low Word Count Penalty**: If any story has fewer than 250 words, reduce its score significantly, as it does not meet the minimum content requirement.

          There are ${
            Object.keys(storyObj).length
          } stories provided in the input. Ensure that the output contains scores for all ${
        Object.keys(storyObj).length
      } stories.

          ### Example Format:

          **Input:**
          {
            "124": "Story content",
            "125": "Story content",
            "126": "Story content"
          }

          **Expected Output:**
          {
            "124": 85,
            "125": 72,
            "126": 90
          }

          ### Now, evaluate and score the following stories:
          ${JSON.stringify(storyObj)}`;

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
      console.log("making api call");
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

  async rankStories(stories, title, iteration, topWritingPercentage) {
    let scores = [];
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < iteration; i++) {
      let groupStories = this.groupStories(stories);

      for (const group of groupStories) {
        console.log("Group size: ", group.length);

        let groupScore;
        let retries = 3; // Limit retries to avoid infinite loops

        while (retries > 0) {
          try {
            // Introduce a delay between API calls to prevent rate limiting
            await sleep(1000); // 1 second delay; adjust as needed

            groupScore = await this.getComparativeScores(group, title);

            // Check if the number of returned scores matches the number of stories in the group
            if (Object.keys(groupScore).length === group.length) {
              console.log("All stories in the group have valid scores.");

              // **Validate that there are no undefined keys or values**
              const validScores = Object.entries(groupScore).reduce(
                (acc, [key, value]) => {
                  if (key && value !== undefined) {
                    // Ensure key and value are defined
                    acc[key] = value;
                  }
                  return acc;
                },
                {}
              );

              if (Object.keys(validScores).length === group.length) {
                scores.push(validScores);
                break; // Exit loop when the result is valid
              } else {
                groupScore = await this.getComparativeScores(group, title);
                console.warn(
                  `Mismatch in valid scores for group of ${group.length} stories. Retrying...`
                );
                retries--;
              }
            } else {
              groupScore = await this.getComparativeScores(group, title);
              console.warn(
                `Mismatch in scores for group of ${group.length} stories. Retrying...`
              );
              retries--;
            }
          } catch (error) {
            console.log("Error in API call:", error);
            retries--;
          }
        }

        // If after retries we still don't get the right result, log the issue and move on
        if (retries === 0) {
          console.error(
            `Failed to get valid scores for group after multiple attempts. Skipping group.`
          );
        }
      }
    }

    // Object to store aggregated scores
    let aggregatedScores = {};

    // Combine scores from all groups
    scores.forEach((score) => {
      Object.keys(score).forEach((storyId) => {
        if (aggregatedScores[storyId]) {
          aggregatedScores[storyId] += score[storyId];
        } else {
          aggregatedScores[storyId] = score[storyId];
        }
      });
    });

    // Get the top percentage based on the aggregated scores
    aggregatedScores = this.getTopPercentage(
      aggregatedScores,
      topWritingPercentage
    );

    this.sendWritingLogsToAdmin(scores, aggregatedScores, title, stories);

    return { aggregatedScores, scores };
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
  getTopPercentage(stories, percentage) {
    // Validate the percentage input
    if (percentage < 0 || percentage > 100 || !percentage) {
      percentage = 50;
    }

    const entries = Object.entries(stories);
    entries.sort((a, b) => b[1] - a[1]);

    // Calculate the number of top entries to return based on the percentage
    const topCount = Math.ceil(entries.length * (percentage / 100));
    const topEntries = entries.slice(0, topCount);

    return Object.fromEntries(topEntries);
  }

  async sendWritingLogsToAdmin(
    scores,
    aggregatedScores,
    contestTitle,
    stories
  ) {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), "data");

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Create a unique output file for storing the scores
      const outputFilePath = path.join(dataDir, `test-${Date.now()}.json`);

      scores = scores.map((score) => {
        const scoreObj = Object.entries(score).map(([key, value]) => {
          const userId = stories.find((s) => s._id.toString() === key)?.email;
          return {
            [userId]: value,
          };
        });
        return scoreObj;
      });

      aggregatedScores = Object.entries(aggregatedScores).map(
        ([key, value]) => {
          const userId = stories.find((s) => s._id.toString() === key)?.email;
          return {
            [userId]: value,
          };
        }
      );

      // Write the response scores and aggregatedScores to the file
      fs.writeFileSync(
        outputFilePath,
        JSON.stringify(
          {
            scores,
            topWritings: aggregatedScores,
          },
          null,
          4
        )
      );

      console.log("File written to:", outputFilePath);

      // Check if the file exists before attaching it
      if (!fs.existsSync(outputFilePath)) {
        throw new Error(`File does not exist: ${outputFilePath}`);
      }

      // Create email attachment
      const attachment = [
        {
          filename: path.basename(outputFilePath),
          path: outputFilePath, // Ensure the path is valid
        },
      ];

      const emailServiceIns = new emailServiceClass();

      await emailServiceIns.sendEmail({
        subject: `Top Writings Logs for ${contestTitle}`,
        attachment,
        email: [process.env.APP_EMAIL],
        message: `Top Writings Logs for ${contestTitle}. Please find the attachment.`,
      });
      try {
        fs.unlinkSync(outputFilePath);
      } catch (error) {
        console.log("failed to delete json log file ....");
      }
    } catch (error) {
      console.log("error while sending writing logs to admin", error);
    }
  }
}

module.exports = GptService;
