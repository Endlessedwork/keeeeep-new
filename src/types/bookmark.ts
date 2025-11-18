export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  summary: string; // AI generated summary
  imageUrl?: string;
  faviconUrl?: string;
  categoryId?: string;
  tags: string[];
  dateAdded: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this should be hashed
  createdAt: string;
}
