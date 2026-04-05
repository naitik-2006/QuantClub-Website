import { 
  BookOpen, 
  TrendingUp, 
  Brain, 
  BarChart2, 
  Sigma, 
  Layers, 
  Code2, 
  Globe, 
  Puzzle, 
  Terminal,
  Cpu,
  Network,
  Settings,
  Database,
  Calculator,
  Zap,
  Star,
  Target
} from 'lucide-react';

export type Category = 
  | 'ALL' 
  | 'MATHEMATICS' 
  | 'FINANCE' 
  | 'MACHINE LEARNING' 
  | 'CODING' 
  | 'CS FUNDAMENTALS' 
  | 'PUZZLES'
  | 'MENTAL MATH'
  | 'ROADMAPS';

export interface Resource {
  id: string;
  title: string;
  author?: string;
  category: Category;
  tags: string[];
  icon: any;
  readTime?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  featured?: boolean;
  description: string;
  href: string;
  isMustDo?: boolean;
  comment?: string;
}

export const CATEGORIES: Category[] = [
  'ALL',
  'MATHEMATICS',
  'FINANCE',
  'MACHINE LEARNING',
  'CODING',
  'CS FUNDAMENTALS',
  'MENTAL MATH',
  'PUZZLES',
  'ROADMAPS',
];

// Category metadata for display
export const CATEGORY_META: Record<Category, { label: string; description: string; color: string }> = {
  ALL:               { label: 'All Resources',    description: 'Browse everything',                                   color: '#00f5d4' },
  MATHEMATICS:       { label: 'Mathematics',       description: 'Probability, Stats, Stochastic Calculus',             color: '#00b4d8' },
  FINANCE:           { label: 'Finance',           description: 'Markets, Derivatives, Financial Theory',              color: '#7b2fff' },
  'MACHINE LEARNING':{ label: 'Machine Learning',  description: 'ML, Deep Learning, Data Science',                    color: '#ff6b6b' },
  CODING:            { label: 'Coding',            description: 'Python, C++, DSA, Competitive Programming',          color: '#ffd166' },
  'CS FUNDAMENTALS': { label: 'CS Fundamentals',   description: 'OS, Architecture, Systems, Networks',               color: '#06d6a0' },
  'MENTAL MATH':     { label: 'Mental Math',       description: 'Speed arithmetic, Vedic math, Mental calculation',   color: '#f77f00' },
  PUZZLES:           { label: 'Puzzles',           description: 'Brainteasers, Logic, Interview prep',               color: '#e040fb' },
  ROADMAPS:          { label: 'Roadmaps',          description: 'Career paths, Strategy, Getting started',           color: '#40c4ff' },
};

