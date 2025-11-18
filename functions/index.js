const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');
const cors = require('cors');

admin.initializeApp();

// CORS middleware
const corsHandler = cors({ origin: true });

// Initialize OpenAI
const getOpenAIClient = () => {
  const apiKey =
    process.env.OPENAI_API_KEY ||
    (functions.config().openai && functions.config().openai.key);
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  return new OpenAI({ apiKey });
};

const getFunctionsBaseUrl = () => {
  const project =
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT ||
    (process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).projectId);
  const region = process.env.GCLOUD_REGION || process.env.FUNCTION_REGION || 'us-central1';

  // Emulators set FIREBASE_FUNCTIONS_EMULATOR_HOST (ex: localhost:5001)
  if (process.env.FIREBASE_FUNCTIONS_EMULATOR_HOST && project) {
    return `http://${process.env.FIREBASE_FUNCTIONS_EMULATOR_HOST}/${project}/${region}`;
  }

  if (!project) {
    throw new Error('Project ID is not configured');
  }

  return `https://${region}-${project}.cloudfunctions.net`;
};

const handlePreflight = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Max-Age', '3600');
  return res.status(204).send('');
};

/**
 * Scrape website content
 * URL: https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/scrapeWebsite
 */
exports.scrapeWebsite = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method === 'OPTIONS') {
        return handlePreflight(req, res);
      }

      // Only allow POST requests
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      // Validate URL
      try {
        new URL(url);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // Fetch the website
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KeeeeepBot/1.0)'
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract metadata
      const title = $('title').text().trim() || 
                    $('meta[property="og:title"]').attr('content') || 
                    $('meta[name="title"]').attr('content') || '';
      
      const description = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') || '';
      
      const imageUrl = $('meta[property="og:image"]').attr('content') || 
                      $('meta[name="image"]').attr('content') || '';
      
      const faviconUrl = $('link[rel="icon"]').attr('href') || 
                        $('link[rel="shortcut icon"]').attr('href') || '';
      
      // Resolve relative URLs
      const resolveUrl = (relativeUrl) => {
        if (!relativeUrl) return '';
        if (relativeUrl.startsWith('http')) return relativeUrl;
        try {
          return new URL(relativeUrl, url).href;
        } catch (e) {
          return '';
        }
      };

      // Extract main content (remove scripts, styles, nav, footer)
      $('script, style, nav, footer, header, aside').remove();
      const mainContent = $('body').text().trim().substring(0, 8000); // Limit content size

      res.status(200).json({
        success: true,
        data: {
          title,
          description,
          imageUrl: resolveUrl(imageUrl),
          faviconUrl: resolveUrl(faviconUrl),
          content: mainContent,
          url
        }
      });

    } catch (error) {
      console.error('Scrape error:', error);
      res.status(500).json({ 
        error: 'Failed to scrape website',
        details: error.message 
      });
    }
  });
});

/**
 * Summarize content using OpenAI
 * URL: https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/summarizeContent
 */
exports.summarizeContent = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method === 'OPTIONS') {
        return handlePreflight(req, res);
      }

      // Only allow POST requests
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { content, url, title } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const openai = getOpenAIClient();

      // Prepare prompt for OpenAI
      const prompt = `Please summarize the following website content in Thai language (2-3 sentences). 
Focus on the main topic and key points:

Website: ${title || url || 'Unknown'}
Content: ${content.substring(0, 4000)} // Limit content to avoid token limits

Summary (in Thai):`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes website content in Thai language. Provide concise, clear summaries focusing on the main topic and key points."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      const summary = completion.choices[0]?.message?.content?.trim() || '';

      res.status(200).json({
        success: true,
        data: { summary }
      });

    } catch (error) {
      console.error('Summarize error:', error);
      res.status(500).json({ 
        error: 'Failed to summarize content',
        details: error.message 
      });
    }
  });
});

/**
 * Combined function: Scrape and Summarize
 * URL: https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/scrapeAndSummarize
 */
exports.scrapeAndSummarize = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method === 'OPTIONS') {
        return handlePreflight(req, res);
      }

      // Only allow POST requests
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      const baseUrl = getFunctionsBaseUrl();

      // Step 1: Scrape the website
      const scrapeResponse = await axios.post(
        `${baseUrl}/scrapeWebsite`,
        { url },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { title, description, imageUrl, faviconUrl, content } = scrapeResponse.data.data;

      // Step 2: Summarize the content
      const summarizeResponse = await axios.post(
        `${baseUrl}/summarizeContent`,
        { 
          content: content.substring(0, 4000),
          url,
          title
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { summary } = summarizeResponse.data.data;

      // Step 3: Return combined result
      res.status(200).json({
        success: true,
        data: {
          title,
          description,
          imageUrl,
          faviconUrl,
          summary,
          url
        }
      });

    } catch (error) {
      console.error('Scrape and Summarize error:', error);
      res.status(500).json({ 
        error: 'Failed to scrape and summarize',
        details: error.message 
      });
    }
  });
});
