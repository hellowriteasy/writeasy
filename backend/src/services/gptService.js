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
      The provided text should be evaluated and scored following a detailed rubric based on the criteria of content, organisation, and technical accuracy. The story's content and organisation should be compelling or clear (depending on the quality) and effectively matched to the intended audience and purpose with a suitable tone, style, and register. Particular attention should be paid to the vocabulary and linguistic devices used, as well as the structure and coherency of ideas presented through well-linked paragraphs. 24 marks is for content and organisation and there is 16 marks for technical accuracy. The total marks is 40. So, you need to grade it accordingly.

      For each writing, please provide a detailed line-by-line analysis, evaluating the following aspects:

      Content 12 marks:
      * Communication is convincing and compelling
      * Tone, style and register are assuredly matched to purpose and
      audience
      * Extensive and ambitious vocabulary with sustained crafting of
      linguistic devices
      Content  10 marks
      * Communication is convincing
      * Tone, style and register are convincingly matched to purpose and
      audience
      * Extensive vocabulary with conscious crafting of linguistic devices
      Content 8 marks
      * Communication is consistently clear
      * Tone, style and register are clearly and consistently matched to
      purpose and audience
      * Increasingly sophisticated vocabulary and phrasing, chosen for
      effect with a range of successful linguistic devices
      Content 6 marks
      * Communication is generally clear
      * Tone, style and register are generally matched to purpose and
      audience
      * Vocabulary clearly chosen for effect and appropriate use of
      linguistic devices
      Content 4 marks
      * Communicates with some sustained success
      * Some sustained attempt to match tone, style and register to
      purpose and audience
      * Conscious use of vocabulary with some use of linguistic devices
      Content 3 marks
      * Communicates with some success
      * Attempts to match tone, style and register to purpose and
      audience
      * Begins to vary vocabulary with some use of linguistic devices
      Content 2 marks
      * Communicates simply
      * Simple awareness of matching tone, style and register to purpose
      and audience
      * Simple vocabulary; simple linguistic devices
      ###
      Organisation 12 marks
      * Varied and inventive use of structural features
      * Writing is compelling, incorporating a range of convincing and
      complex ideas
      * Fluently link
      Organisation 10 marks
      * Varied and effective structural features
      * Writing is highly engaging with a range of developed complex
      ideas
      * Consistently coherent use of paragraphs with integrated discourse
      markers
      Organisation 8 marks
      * Effective use of structural features
      * Writing is engaging, using a range of clear, connected ideas
      * Coherent paragraphs with integrated discourse markers
      Organisation 6 marks
      * Usually effective use of structural features
      * Writing is engaging, with a range of connected ideas
      * Usually coherent paragraphs with range of discourse markers
      Organisation 4 marks
      * Some use of structural features
      * Increasing variety of linked and relevant ideas
      * Some use of paragraphs and some use of discourse markers
      Organisation 3 marks
      * Attempts to use structural features
      * Some linked and relevant ideas
      * Attempt to write in paragraphs with some discourse markers, not
      always appropriate
      Organisation 2 marks
      * Evidence of simple structural features
      * One or two relevant ideas, simply linked
      * Random paragraph structure or No paragraphs
      ###
      Technical Accuracy 15 marks:
      * Sentence demarcation is consistently secure and consistently accurate
      * Wide range of punctuation is used with a high level of accuracy
      * Uses a full range of appropriate sentence forms for effect
      * Uses Standard English consistently and appropriately with secure control of
      complex grammatical structures
      * High level of accuracy in spelling, including ambitious vocabulary
      * Extensive and ambitious use of vocabulary
      Technical Accuracy 11 marks:
      * Sentence demarcation is mostly secure and mostly accurate
      * Range of punctuation is used, mostly with success
      * Uses a variety of sentence forms for effect
      * Mostly uses Standard English appropriately with mostly controlled
      grammatical structures
      * Generally accurate spelling, including complex and irregular words
      * Increasingly sophisticated use of vocabulary
      Technical Accuracy 7 marks:
      * Sentence demarcation is mostly secure and sometimes accurate
      * Some control of a range of punctuation
      * Attempts a variety of sentence forms
      * Some use of Standard English with some control of agreement
      * Some accurate spelling of more complex words
      * Varied use of vocabulary
      Technical Accuracy 3 marks:
      * Occasional use of sentence demarcation
      * Some evidence of conscious punctuation
      * Simple range of sentence forms
      * Occasional use of Standard English with limited control of agreement
      * Accurate basic spelling
      * Simple use of vocabulary

      If the content includes any inappropriate themes such as violence or explicit content, immediately assign a score of 0.

      Please provide the numerical score strictly in the first line based solely on this rubric. Additionally, You are a master proofreader. Only proofread the given text, don't add new text to the document. \n(${systemMessage[taskType]}). \n Start this from the second line of your response. Once again, Please provide the numerical score strictly in the first line!!!
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
        "Rewrite this text improving clarity and flow . You may also add new line to make writings more good.",
      improve:
        "Proofread this text improving clarity and flow.Dont add new line just modify the text",
    };

    const detailedPrompt = `
      The provided text should be evaluated and scored following a detailed rubric based on the criteria of content, organisation, and technical accuracy. The story's content and organisation should be compelling or clear (depending on the quality) and effectively matched to the intended audience and purpose with a suitable tone, style, and register. Particular attention should be paid to the vocabulary and linguistic devices used, as well as the structure and coherency of ideas presented through well-linked paragraphs. 24 marks is for content and organisation and there is 16 marks for technical accuracy. The total marks is 40. So, you need to grade it accordingly.

      For each writing, please provide a detailed line-by-line analysis, evaluating the following aspects:

      Content 12 marks:
      * Communication is convincing and compelling
      * Tone, style and register are assuredly matched to purpose and
      audience
      * Extensive and ambitious vocabulary with sustained crafting of
      linguistic devices
      Content  10 marks
      * Communication is convincing
      * Tone, style and register are convincingly matched to purpose and
      audience
      * Extensive vocabulary with conscious crafting of linguistic devices
      Content 8 marks
      * Communication is consistently clear
      * Tone, style and register are clearly and consistently matched to
      purpose and audience
      * Increasingly sophisticated vocabulary and phrasing, chosen for
      effect with a range of successful linguistic devices
      Content 6 marks
      * Communication is generally clear
      * Tone, style and register are generally matched to purpose and
      audience
      * Vocabulary clearly chosen for effect and appropriate use of
      linguistic devices
      Content 4 marks
      * Communicates with some sustained success
      * Some sustained attempt to match tone, style and register to
      purpose and audience
      * Conscious use of vocabulary with some use of linguistic devices
      Content 3 marks
      * Communicates with some success
      * Attempts to match tone, style and register to purpose and
      audience
      * Begins to vary vocabulary with some use of linguistic devices
      Content 2 marks
      * Communicates simply
      * Simple awareness of matching tone, style and register to purpose
      and audience
      * Simple vocabulary; simple linguistic devices
      ###
      Organisation 12 marks
      * Varied and inventive use of structural features
      * Writing is compelling, incorporating a range of convincing and
      complex ideas
      * Fluently link
      Organisation 10 marks
      * Varied and effective structural features
      * Writing is highly engaging with a range of developed complex
      ideas
      * Consistently coherent use of paragraphs with integrated discourse
      markers
      Organisation 8 marks
      * Effective use of structural features
      * Writing is engaging, using a range of clear, connected ideas
      * Coherent paragraphs with integrated discourse markers
      Organisation 6 marks
      * Usually effective use of structural features
      * Writing is engaging, with a range of connected ideas
      * Usually coherent paragraphs with range of discourse markers
      Organisation 4 marks
      * Some use of structural features
      * Increasing variety of linked and relevant ideas
      * Some use of paragraphs and some use of discourse markers
      Organisation 3 marks
      * Attempts to use structural features
      * Some linked and relevant ideas
      * Attempt to write in paragraphs with some discourse markers, not
      always appropriate
      Organisation 2 marks
      * Evidence of simple structural features
      * One or two relevant ideas, simply linked
      * Random paragraph structure or No paragraphs
      ###
      Technical Accuracy 15 marks:
      * Sentence demarcation is consistently secure and consistently accurate
      * Wide range of punctuation is used with a high level of accuracy
      * Uses a full range of appropriate sentence forms for effect
      * Uses Standard English consistently and appropriately with secure control of
      complex grammatical structures
      * High level of accuracy in spelling, including ambitious vocabulary
      * Extensive and ambitious use of vocabulary
      Technical Accuracy 11 marks:
      * Sentence demarcation is mostly secure and mostly accurate
      * Range of punctuation is used, mostly with success
      * Uses a variety of sentence forms for effect
      * Mostly uses Standard English appropriately with mostly controlled
      grammatical structures
      * Generally accurate spelling, including complex and irregular words
      * Increasingly sophisticated use of vocabulary
      Technical Accuracy 7 marks:
      * Sentence demarcation is mostly secure and sometimes accurate
      * Some control of a range of punctuation
      * Attempts a variety of sentence forms
      * Some use of Standard English with some control of agreement
      * Some accurate spelling of more complex words
      * Varied use of vocabulary
      Technical Accuracy 3 marks:
      * Occasional use of sentence demarcation
      * Some evidence of conscious punctuation
      * Simple range of sentence forms
      * Occasional use of Standard English with limited control of agreement
      * Accurate basic spelling
      * Simple use of vocabulary

      If the content includes any inappropriate themes such as violence or explicit content, immediately assign a score of 0.

      Please provide the numerical score strictly in the first line based solely on this rubric. Additionally, You are a master proofreader. Only proofread the given text, don't add new text to the document. \n(${systemMessage[taskType]}). \n Start this from the second line of your response. Once again, Please provide the numerical score strictly in the first line!!!
    `;

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

            // Check if the string is a valid JSON string
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
}

module.exports = GptService;
