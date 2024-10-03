export type TUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  lastLogin: string;
  profile_picture?: string;
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
  correctionSummary: string;
  contest?: TContest;
  prompt: TPrompt;
  storyType: string;
  contributors: TUser[];
  hasEnded: boolean;
  position?: number;
  isTopWriting?:boolean
};

export type TPrompt = {
  _id: string;
  title: string;
  promptCategory: string[];
  promptType: string;
  __v: number;
  description: string;
  type: string;
  contestId?:TContest
};

export type TContest = {
  _id: string;
  contestTheme: string;
  description: string;
  isActive: boolean;
  prompts: TPrompt[];
  topWritingPercent: number;
  image?: string;
  score?: number;
  comparisionCount: number | undefined;
  promptPublishDate: string; // Assuming ISO 8601 format
  submissionDeadline: string; // Assuming ISO 8601 format
  topWritingPublishDate: string; // Assuming ISO 8601 format
  topWritingPublished: boolean;
  __v: number;
};

export type Params = {
  _id: string;
};

export type TFAQ = {
  _id: string;
  question: string;
  answer: string;
  place: number;
};
export type TTaskType = "improve" | "grammer" | "rewrite";

export type TPageDetails = {
  page: number;
  total: number;
  perPage: number;
}