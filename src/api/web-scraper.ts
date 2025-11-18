import { getOpenAIChatResponse } from "./chat-service";

export interface WebMetadata {
  title: string;
  description: string;
  imageUrl?: string;
  faviconUrl?: string;
  url: string;
}

/**
 * Fetch metadata from a URL
 * @param url - The URL to fetch metadata from
 * @returns The metadata from the URL
 */
export const fetchWebMetadata = async (url: string): Promise<WebMetadata> => {
  try {
    // Ensure URL has protocol
    let fullUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = "https://" + url;
    }

    const response = await fetch(fullUrl);
    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : fullUrl;

    // Extract meta description
    const descMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
    );
    let description = descMatch ? descMatch[1].trim() : "";

    // Try og:description if regular description not found
    if (!description) {
      const ogDescMatch = html.match(
        /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
      );
      description = ogDescMatch ? ogDescMatch[1].trim() : "";
    }

    // Extract og:image or first image
    let imageUrl: string | undefined;
    const ogImageMatch = html.match(
      /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
    );
    if (ogImageMatch) {
      imageUrl = ogImageMatch[1];
      // Handle relative URLs
      if (imageUrl && !imageUrl.startsWith("http")) {
        const urlObj = new URL(fullUrl);
        imageUrl = urlObj.origin + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl);
      }
    }

    // Extract favicon
    let faviconUrl: string | undefined;
    const faviconMatch = html.match(
      /<link\s+[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i
    );
    if (faviconMatch) {
      faviconUrl = faviconMatch[1];
      if (faviconUrl && !faviconUrl.startsWith("http")) {
        const urlObj = new URL(fullUrl);
        faviconUrl = urlObj.origin + (faviconUrl.startsWith("/") ? faviconUrl : "/" + faviconUrl);
      }
    } else {
      // Default to /favicon.ico
      const urlObj = new URL(fullUrl);
      faviconUrl = urlObj.origin + "/favicon.ico";
    }

    return {
      title,
      description,
      imageUrl,
      faviconUrl,
      url: fullUrl,
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    // Return basic metadata if fetch fails
    return {
      title: url,
      description: "",
      url: url,
    };
  }
};

/**
 * Generate AI summary of web content
 * @param metadata - The metadata from the web page
 * @returns The AI generated summary
 */
export const generateWebSummary = async (
  metadata: WebMetadata
): Promise<string> => {
  try {
    const prompt = `สรุปเนื้อหาของเว็บไซต์นี้ให้กระชับและชัดเจนในภาษาไทย:

ชื่อเว็บ: ${metadata.title}
คำอธิบาย: ${metadata.description || "ไม่มีคำอธิบาย"}
URL: ${metadata.url}

กรุณาสรุปเป็นประโยคสั้นๆ 2-3 ประโยคว่าเว็บไซต์นี้เกี่ยวกับอะไร มีประโยชน์อย่างไร`;

    const response = await getOpenAIChatResponse(prompt);
    return response.content || "ไม่สามารถสรุปเนื้อหาได้";
  } catch (error) {
    console.error("Error generating summary:", error);
    return metadata.description || "ไม่สามารถสรุปเนื้อหาได้";
  }
};
