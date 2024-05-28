const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Writeasy API Documentation",
      version: "1.0.0",
      description:
        "Writeasy is a collaborative writing platform allowing users to create, share, and enhance their writing. API documentation maintained by Suyamoon Pathak.",
      contact: {
        name: "Suyamoon Pathak",
        email: "suyamoonpathak@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Admin: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "The username of the admin",
            },
            email: {
              type: "string",
              description: "The email of the admin",
            },
            password: {
              type: "string",
              description: "The password of the admin",
            },
          },
        },
        CollaborativeStory: {
          type: "object",
          properties: {
            creatorUser: {
              type: "string",
              description: "The creator user of the collaborative story",
            },
            title: {
              type: "string",
              description: "The title of the collaborative story",
            },
            content: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Content",
              },
              description: "The content of the collaborative story",
            },
            contributors: {
              type: "array",
              items: {
                type: "string",
                description: "The contributors of the collaborative story",
              },
            },
            creationDateTime: {
              type: "string",
              format: "date-time",
              description: "The creation datetime of the collaborative story",
            },
          },
        },
        Collaborator: {
          type: "object",
          properties: {
            storyID: {
              type: "string",
              description: "The ID of the collaborative story",
            },
            userID: {
              type: "string",
              description: "The ID of the user",
            },
          },
        },
        Contest: {
          type: "object",
          properties: {
            prompts: {
              type: "array",
              items: {
                type: "string",
                description: "The IDs of the prompts",
              },
            },
            contestTheme: {
              type: "string",
              description: "The theme of the contest",
            },
            submissionDeadline: {
              type: "string",
              format: "date-time",
              description: "The submission deadline of the contest",
            },
            isActive: {
              type: "boolean",
              description: "The active status of the contest",
            },
          },
        },
        ContestSubmission: {
          type: "object",
          properties: {
            user: {
              type: "string",
              description: "The ID of the user",
            },
            contest: {
              type: "string",
              description: "The ID of the contest",
            },
            submissionContent: {
              type: "string",
              description: "The content of the contest submission",
            },
            submissionDateTime: {
              type: "string",
              format: "date-time",
              description: "The submission datetime of the contest",
            },
            score: {
              type: "number",
              description: "The score of the contest submission",
            },
          },
        },
        Prompt: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The prompt text",
            },
            promptCategory: {
              type: "array",
              items: {
                type: "string",
                description: "The genres of the prompts",
              },
            },
            promptType: {
              type: "string",
              enum: ["practice", "contest","game"],
              description:
                "The type of the prompt (practice or contest or game)",
            },
          },
        },
        Story: {
          type: "object",
          properties: {
            user: {
              type: "string",
              description: "The ID of the user",
            },
            title: {
              type: "string",
              description: "The title of the story",
            },
            content: {
              type: "string",
              description: "The content of the story",
            },
            wordCount: {
              type: "number",
              description: "The word count of the story",
            },
            submissionDateTime: {
              type: "string",
              format: "date-time",
              description: "The submission datetime of the story",
            },
            score: {
              type: "number",
              description: "The score of the story",
            },
            corrections: {
              type: "string",
              description: "The corrections given by the OpenAI Api",
            },
            contest: {
              type: "string",
              description: "The ID of the contest",
            },
            prompt: {
              type: "string",
              description: "The ID of the prompt",
            },
            storyType: {
              type: "string",
              enum: ["practiceStory", "contestStory"],
              description:
                "The type of the story (practiceStory or contestStory)",
            },
          },
        },
        StoryCorrection: {
          type: "object",
          properties: {
            storyID: {
              type: "string",
              description: "The ID of the story",
            },
            correctionContent: {
              type: "string",
              description: "The content of the story correction",
            },
            correctionType: {
              type: "string",
              enum: ["Line-by-Line", "Summary"],
              description: "The type of the story correction",
            },
            score: {
              type: "number",
              description: "The score of the story correction",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "The username of the user",
            },
            email: {
              type: "string",
              description: "The email of the user",
            },
            password: {
              type: "string",
              description: "The password of the user",
            },
            googleId: {
              type: "string",
              description: "The Google ID of the user",
            },
            subscriptionType: {
              type: "string",
              enum: ["free", "paid"],
              default: "free",
              description: "The subscription type of the user",
            },
            lastLogin: {
              type: "string",
              format: "date-time",
              description: "The last login datetime of the user",
            },
            role: {
              type: "string",
              description: "The role of the user (user or admin)",
            },
          },
        },
        Content: {
          type: "object",
          properties: {
            author: {
              type: "string",
              description: "The ID of the author",
            },
            text: {
              type: "string",
              description: "The text content",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "The timestamp of the content",
            },
            approved: {
              type: "boolean",
              description: "The approval status of the content",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
