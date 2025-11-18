import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Bookmark, Category } from '../types/bookmark';

export class BookmarkService {
  // Bookmarks
  static async getBookmarks(userId: string): Promise<Bookmark[]> {
    try {
      const bookmarksRef = collection(db, 'bookmarks');
      // Avoid Firestore composite index requirement by sorting client-side
      const q = query(bookmarksRef, where('userId', '==', userId));
      
      const querySnapshot = await getDocs(q);
      const bookmarks: Bookmark[] = [];
      
      querySnapshot.forEach((doc) => {
        bookmarks.push({
          id: doc.id,
          ...doc.data()
        } as Bookmark);
      });

      // Sort newest first on client
      return bookmarks.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  }

  static async addBookmark(bookmark: Omit<Bookmark, 'id'>): Promise<string> {
    try {
      // Filter out undefined values to prevent Firestore errors
      const cleanBookmark = Object.fromEntries(
        Object.entries(bookmark).filter(([_, value]) => value !== undefined)
      );
      
      const bookmarksRef = collection(db, 'bookmarks');
      const docRef = await addDoc(bookmarksRef, cleanBookmark);
      return docRef.id;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  static async updateBookmark(id: string, updates: Partial<Bookmark>): Promise<void> {
    try {
      const bookmarkRef = doc(db, 'bookmarks', id);
      await updateDoc(bookmarkRef, updates);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
  }

  static async deleteBookmark(id: string): Promise<void> {
    try {
      const bookmarkRef = doc(db, 'bookmarks', id);
      await deleteDoc(bookmarkRef);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  }

  static async getBookmarksByCategory(userId: string, categoryId?: string): Promise<Bookmark[]> {
    try {
      const bookmarksRef = collection(db, 'bookmarks');
      let q;
      
      if (categoryId) {
        q = query(
          bookmarksRef, 
          where('userId', '==', userId),
          where('categoryId', '==', categoryId)
        );
      } else {
        q = query(
          bookmarksRef, 
          where('userId', '==', userId)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const bookmarks: Bookmark[] = [];
      
      querySnapshot.forEach((doc) => {
        bookmarks.push({
          id: doc.id,
          ...doc.data()
        } as Bookmark);
      });

      return bookmarks.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    } catch (error) {
      console.error('Error fetching bookmarks by category:', error);
      throw error;
    }
  }

  static async searchBookmarks(userId: string, searchQuery: string): Promise<Bookmark[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation - consider using Algolia or similar for production
      const allBookmarks = await this.getBookmarks(userId);
      
      const lowerQuery = searchQuery.toLowerCase();
      return allBookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(lowerQuery) ||
        bookmark.description.toLowerCase().includes(lowerQuery) ||
        bookmark.summary.toLowerCase().includes(lowerQuery) ||
        bookmark.url.toLowerCase().includes(lowerQuery) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching bookmarks:', error);
      throw error;
    }
  }

  // Categories
  static async getCategories(userId: string): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, 'categories');
      const q = query(
        categoriesRef, 
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];
      
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data()
        } as Category);
      });
      
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  static async addCategory(category: Omit<Category, 'id'>): Promise<string> {
    try {
      const categoriesRef = collection(db, 'categories');
      const docRef = await addDoc(categoriesRef, category);
      return docRef.id;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }

  static async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, updates);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    try {
      const categoryRef = doc(db, 'categories', id);
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Initialize default categories for new user
  static async initializeDefaultCategories(userId: string): Promise<void> {
    try {
      const defaultCategories = [
        {
          name: "ทั่วไป",
          color: "#3B82F6",
          icon: "folder",
          userId,
        },
        {
          name: "งาน",
          color: "#EF4444",
          icon: "briefcase",
          userId,
        },
        {
          name: "การเรียนรู้",
          color: "#10B981",
          icon: "school",
          userId,
        },
      ];

      for (const category of defaultCategories) {
        await this.addCategory(category);
      }
    } catch (error) {
      console.error('Error initializing default categories:', error);
      throw error;
    }
  }
}
