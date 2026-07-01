export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  hero_img_url: string;
  content: string;
  author: Author;
  createdAt: string;
  comments: Comment[];
  likes: Like[];
  updatedAt: string;
  published: boolean;
}

export interface Like {
  id: string;
  postId: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  firstName: string;
  lastName: string;
}

export interface CommentFormData {
  name: string;
  email: string;
  body: string;
}
