import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class AIService {
  /**
   * Mock audio transcription service for dev/hackathon.
   * @param {string} filePath
   * @returns {Promise<string>}
   */
  static async transcribeAudio(filePath) {
    logger.info(`[AIService] Transcribing audio file at ${filePath}...`);
    return "I have been cooking traditional Tamil food for 20 years and teach women how to make homemade snacks.";
  }

  /**
   * Parses voice onboarding transcript into structured JSON.
   * @param {string} transcript
   * @returns {Promise<{ identifiedSkills: Array<{name: string, confidence: number}>, yearsOfExperience: number, suggestedProfileTitle: string, suggestedCategories: string[], summary: string }>}
   */
  static async parseVoiceProfile(transcript) {
    logger.info(`[AIService] Parsing voice profile for transcript: "${transcript}"`);
    const lower = transcript.toLowerCase();

    if (lower.includes('cook') || lower.includes('food') || lower.includes('snack') || lower.includes('tamil')) {
      return {
        identifiedSkills: [
          { name: 'Traditional Tamil Cooking', confidence: 0.96 },
          { name: 'Cooking Teacher', confidence: 0.92 },
          { name: 'Traditional Recipes', confidence: 0.88 },
          { name: 'Food Preservation', confidence: 0.85 },
        ],
        yearsOfExperience: 20,
        suggestedProfileTitle: 'Master Home Chef & Traditional Cooking Instructor',
        suggestedCategories: ['Cooking', 'Tutoring', 'Home Catering'],
        summary: 'Experienced home cook specializing in traditional South Indian recipes and culinary teaching.',
      };
    }

    if (lower.includes('tailor') || lower.includes('sew') || lower.includes('stitch') || lower.includes('dress')) {
      return {
        identifiedSkills: [
          { name: 'Blouse Stitching', confidence: 0.95 },
          { name: 'Saree Fall & Picco', confidence: 0.93 },
          { name: 'Embroidery', confidence: 0.89 },
          { name: 'Custom Alterations', confidence: 0.87 },
        ],
        yearsOfExperience: 15,
        suggestedProfileTitle: 'Expert Custom Tailor & Designer',
        suggestedCategories: ['Tailoring', 'Handicrafts'],
        summary: 'Specializes in traditional women attire tailoring, embroidery, and alterations.',
      };
    }

    return {
      identifiedSkills: [
        { name: 'Home Tutoring', confidence: 0.90 },
        { name: 'Child Mentoring', confidence: 0.85 },
        { name: 'Storytelling', confidence: 0.82 },
      ],
      yearsOfExperience: 10,
      suggestedProfileTitle: 'Senior Tutor & Student Mentor',
      suggestedCategories: ['Tutoring', 'Mentoring'],
      summary: 'Passionate about nurturing young minds and teaching core subjects with patience.',
    };
  }

  /**
   * Generates a structured draft listing from voice transcript or text.
   * @param {string} prompt
   * @returns {Promise<object>}
   */
  static async generateListing(prompt) {
    logger.info(`[AIService] Generating draft listing for prompt: "${prompt}"`);
    const lower = prompt.toLowerCase();

    if (lower.includes('pickle') || lower.includes('papad') || lower.includes('jam') || lower.includes('product')) {
      return {
        type: 'product',
        title: 'Homemade Authentic Mango Pickle (500g)',
        description: 'Handcrafted traditional home-style mango pickle made with pure sesame oil and freshly ground Indian spices.',
        category: 'Handmade Food',
        skills: ['Food Preservation', 'Traditional Cooking'],
        suggestedPriceRange: { min: 250, max: 350, unit: 'jar' },
        tags: ['Homemade', 'No Preservatives', 'Traditional Pickle', 'Chennai Special'],
        seniorFriendlyExplanation: 'Handmade pickles are high in demand in your locality. Pricing per 500g jar offers a strong profit margin.',
      };
    }

    return {
      type: 'service',
      title: 'Traditional Tamil Cooking Classes',
      description: 'Learn authentic South Indian home cooking, tiffin items, and traditional festival recipes from an experienced local home chef.',
      category: 'Cooking',
      skills: ['Traditional Tamil Cooking', 'Cooking Instruction', 'Meal Prep'],
      suggestedPriceRange: { min: 300, max: 500, unit: 'hour' },
      tags: ['Tamil food', 'home cooking', 'offline classes', 'tiffin recipes'],
      seniorFriendlyExplanation: 'Based on your 20 years of cooking experience, conducting weekend home classes is a wonderful way to share your knowledge and earn steadily.',
    };
  }

  /**
   * Parses natural language marketplace search queries into MongoDB structured filters.
   * @param {string} query
   * @returns {Promise<{ structuredFilters: object }>}
   */
  static async parseNaturalLanguageSearch(query) {
    logger.info(`[AIService] Parsing natural language search: "${query}"`);
    const lower = query.toLowerCase();

    const filters = {};

    if (lower.includes('tutor') || lower.includes('teach') || lower.includes('class')) {
      filters.category = 'Tutoring';
    } else if (lower.includes('cook') || lower.includes('food') || lower.includes('chef')) {
      filters.category = 'Cooking';
    } else if (lower.includes('tailor') || lower.includes('stitch')) {
      filters.category = 'Tailoring';
    }

    if (lower.includes('tamil')) filters.language = 'ta';
    if (lower.includes('hindi')) filters.language = 'hi';
    if (lower.includes('english')) filters.language = 'en';

    if (lower.includes('chennai')) filters.city = 'Chennai';
    if (lower.includes('bengaluru') || lower.includes('bangalore')) filters.city = 'Bengaluru';
    if (lower.includes('hyderabad')) filters.city = 'Hyderabad';

    if (lower.includes('online')) filters.mode = 'online';
    if (lower.includes('offline') || lower.includes('near me')) filters.mode = 'offline';

    const priceMatch = query.match(/under\s*₹?\s*(\d+)/i) || query.match(/below\s*₹?\s*(\d+)/i) || query.match(/less than\s*₹?\s*(\d+)/i);
    if (priceMatch) {
      filters.maxPrice = parseInt(priceMatch[1], 10);
    }

    return { structuredFilters: filters };
  }

  /**
   * Suggests price range with senior-friendly explanation.
   * @param {{ category: string, yearsOfExperience: number, city?: string }} params
   */
  static async suggestPricing(params) {
    const baseMin = 250;
    const expMultiplier = Math.min((params.yearsOfExperience || 0) * 15, 300);
    const min = baseMin + expMultiplier;
    const max = min + 200;

    return {
      suggestedMin: min,
      suggestedMax: max,
      currency: 'INR',
      unit: 'hour',
      seniorFriendlyExplanation: `Based on your ${params.yearsOfExperience || 0} years of experience in ${params.city || 'your city'}, similar experienced providers charge between ₹${min} and ₹${max} per hour.`,
    };
  }
}

