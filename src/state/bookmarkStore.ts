import { create } from "zustand";
import { Bookmark, Category } from "../types/bookmark";
import { BookmarkService } from "../services/bookmarkService";
import { useAuthStore } from "./authStore";

interface BookmarkState {
  bookmarks: Bookmark[];
  categories: Category[];
  loading: boolean;
  
  fetchBookmarks: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addBookmark: (bookmark: Omit<Bookmark, 'id'>) => Promise<boolean>;
  removeBookmark: (id: string) => Promise<boolean>;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => Promise<boolean>;
  getBookmarksByCategory: (categoryId?: string) => Bookmark[];
  getBookmarksByTag: (tag: string) => Bookmark[];
  searchBookmarks: (query: string) => Promise<Bookmark[]>;
  
  addCategory: (category: Omit<Category, 'id'>) => Promise<boolean>;
  removeCategory: (id: string) => Promise<boolean>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<boolean>;
  initializeUserData: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  categories: [],
  loading: false,

  fetchBookmarks: async () => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return;

    try {
      set({ loading: true });
      const bookmarks = await BookmarkService.getBookmarks(currentUser.id);
      set({ bookmarks, loading: false });
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return;

    try {
      const categories = await BookmarkService.getCategories(currentUser.id);
      set({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },

  addBookmark: async (bookmarkData) => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return false;

    try {
      // Ensure all required fields have values (not undefined)
      const bookmark: Omit<Bookmark, 'id'> = {
        url: bookmarkData.url || '',
        title: bookmarkData.title || '',
        description: bookmarkData.description || '',
        summary: bookmarkData.summary || '',
        ...(bookmarkData.imageUrl && { imageUrl: bookmarkData.imageUrl }),
        ...(bookmarkData.faviconUrl && { faviconUrl: bookmarkData.faviconUrl }),
        categoryId: bookmarkData.categoryId || '',
        tags: bookmarkData.tags || [],
        dateAdded: bookmarkData.dateAdded || new Date().toISOString(),
        userId: currentUser.id,
      };
      
      const id = await BookmarkService.addBookmark(bookmark);
      
      // Update local state
      const newBookmark = { ...bookmark, id };
      set((state) => ({ bookmarks: [newBookmark, ...state.bookmarks] }));
      
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return false;
    }
  },

  removeBookmark: async (id) => {
    try {
      await BookmarkService.deleteBookmark(id);
      set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== id),
      }));
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      return false;
    }
  },

  updateBookmark: async (id, updates) => {
    try {
      await BookmarkService.updateBookmark(id, updates);
      set((state) => ({
        bookmarks: state.bookmarks.map((b) =>
          b.id === id ? { ...b, ...updates } : b
        ),
      }));
      return true;
    } catch (error) {
      console.error('Error updating bookmark:', error);
      return false;
    }
  },

  getBookmarksByCategory: (categoryId) => {
    const { bookmarks } = get();
    if (!categoryId) {
      return bookmarks;
    }
    return bookmarks.filter((b) => b.categoryId === categoryId);
  },

  getBookmarksByTag: (tag) => {
    const { bookmarks } = get();
    return bookmarks.filter((b) => b.tags.includes(tag));
  },

  searchBookmarks: async (query) => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return [];

    try {
      const results = await BookmarkService.searchBookmarks(currentUser.id, query);
      return results;
    } catch (error) {
      console.error('Error searching bookmarks:', error);
      return [];
    }
  },

  addCategory: async (categoryData) => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return false;

    try {
      const category = {
        ...categoryData,
        userId: currentUser.id,
      };
      const id = await BookmarkService.addCategory(category);
      
      // Update local state
      const newCategory = { ...category, id };
      set((state) => ({ categories: [...state.categories, newCategory] }));
      
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  },

  removeCategory: async (id) => {
    try {
      await BookmarkService.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      return true;
    } catch (error) {
      console.error('Error removing category:', error);
      return false;
    }
  },

  updateCategory: async (id, updates) => {
    try {
      await BookmarkService.updateCategory(id, updates);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  },

  initializeUserData: async () => {
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) return;

    try {
      await Promise.all([
        BookmarkService.initializeDefaultCategories(currentUser.id),
        get().fetchCategories(),
        get().fetchBookmarks(),
      ]);
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  },
}));
