import { FIREBASE_FUNCTIONS_URL } from '../config/firebase';

export class FunctionsService {
  /**
   * Scrape website and get metadata
   */
  static async scrapeWebsite(url: string): Promise<{
    title: string;
    description: string;
    imageUrl: string;
    faviconUrl: string;
    content: string;
  }> {
    try {
      const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/scrapeWebsite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape website');
      }

      return data.data;
    } catch (error) {
      console.error('Error scraping website:', error);
      throw error;
    }
  }

  /**
   * Summarize content using AI
   */
  static async summarizeContent(content: string, url: string, title: string): Promise<string> {
    try {
      const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/summarizeContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, url, title }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize content');
      }

      return data.data.summary;
    } catch (error) {
      console.error('Error summarizing content:', error);
      throw error;
    }
  }

  /**
   * Scrape and summarize in one call
   */
  static async scrapeAndSummarize(url: string): Promise<{
    title: string;
    description: string;
    imageUrl: string;
    faviconUrl: string;
    summary: string;
  }> {
    try {
      const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/scrapeAndSummarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape and summarize');
      }

      return data.data;
    } catch (error) {
      console.error('Error scraping and summarizing:', error);
      throw error;
    }
  }
}