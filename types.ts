
export enum PostType {
  Problem = 'problem',
  Idea = 'idea',
  Solution = 'solution',
  Showcase = 'showcase',
}

export enum Stage {
  Idea = 'idea',
  Prototype = 'prototype',
  MVP = 'mvp',
  Launched = 'launched',
  PMF = 'pmf',
}

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export enum PotentialImpact {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Highlight {
  id: string;
  title: string;
  coverUrl: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  highlights?: Highlight[];
}

export interface Post {
  id: string;
  author: User;
  type: PostType;
  title: string;
  summary: string;
  content_md: string;
  tags: string[];
  industries: string[];
  stage: Stage;
  difficulty?: Difficulty;
  potential_impact?: PotentialImpact;
  is_reel?: boolean;
  coverMedia?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  additionalMedia?: {
    type: 'image' | 'video';
    url: string;
  }[];
  stats: {
    likes: number;
    comments: number;
    saves: number;
    shares: number;
  };
}

export interface PostFormData {
  type: PostType;
  title: string;
  summary: string;
  content_md: string;
  tags: string[];
  industries: string[];
  stage: Stage;
  difficulty: Difficulty;
  potential_impact: PotentialImpact;
  coverMedia?: File;
  additionalMedia: File[];
  is_reel: boolean;
}

export type Page = 'feed' | 'explore';
