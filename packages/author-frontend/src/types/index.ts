// Matches Prisma User model
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

// Matches Prisma Post model
export interface Post {
  id: string;
  title: string;
  subtitle: string | null;
  hero_img_url: string;
  content: string;
  published: boolean;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  _count?: {
    comments: number;
    likes: number;
  };
}

// For create / edit form
export interface PostFormData {
  title: string;
  subtitle: string;
  hero_img_url: string;
  content: string;
  published: boolean;
}

// Auth
export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
