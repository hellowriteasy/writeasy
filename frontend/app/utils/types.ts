export type TUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  lastLogin: string;
  isSubcriptionActive: boolean;
  subscriptionRemainingDays: number | null;
  __v: number;
};

export type TStory = {
  _id: string;
  user: TUser;
  title: string;
  content: string;
  wordCount: number;
  submissionDateTime: string;
  score: number;
  corrections: string;
  contest: string;
  prompt: string;
  storyType: string;
  contributors: TUser[];
  hasEnded: boolean;
};

export type TPrompt = {
  _id: string;
  title: string;
  promptCategory: string[];
  promptType: string;
  __v: number;
  description: string;
};

export type TContest = {
  _id: string;
  contestTheme: string;
  description: string;
  isActive: boolean;
  prompts: TPrompt[];
  promptPublishDate: string; // Assuming ISO 8601 format
  submissionDeadline: string; // Assuming ISO 8601 format
  topWritingPublishDate: string; // Assuming ISO 8601 format
  __v: number;
};
