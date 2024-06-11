export type TUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  lastLogin: string;
  isSubcriptionActive:boolean,
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
