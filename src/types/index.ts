export type CountryVerdict = 'green' | 'yellow' | 'red';

export interface Community {
  name: string;
  location: string;
  activities: string;
}

export interface Country {
  id: string;
  name: string;
  verdict: CountryVerdict;
  rules: string;
  languages: string;
  communities: Community[];
  costOfLiving: number;
  internetSpeed: number;
  communityStrength: number;
  pros: string[];
  cons: string[];
  headerImage: string;
}

export interface Comment {
  id: string;
  countryId: string;
  author: string;
  avatarUrl: string;
  date: string;
  content: string;
}

export interface Story {
  id: string;
  countryId: string;
  author: string;
  avatarUrl: string;
  title: string;
  content: string;
  date: string;
}

export interface FeaturedDestination {
  id: string;
  name: string;
  image: string;
  teaser: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    value: string;
  }[];
}

export interface QuizResult {
  countryId: string;
  score: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  currentCountry: string;
  preferredLanguage: string;
  avatarUrl?: string;
  membershipType: 'free' | 'premium';
  joinedDate: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}