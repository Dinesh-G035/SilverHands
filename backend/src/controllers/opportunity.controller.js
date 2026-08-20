import { Opportunity } from '../models/Opportunity.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getOpportunities = async (req, res, next) => {
  try {
    const userCity = req.user?.city || 'Chennai';
    const userExp = req.user?.yearsOfExperience || 5;

    // Fetch opportunities matching city or general
    let opps = await Opportunity.find({
      $or: [
        { targetCities: { $in: [userCity] } },
        { targetCities: { $size: 0 } },
      ],
    });

    if (opps.length === 0) {
      // Fallback default sample cards for Senior Citizens and Homemakers
      opps = [
        {
          title: 'Homemade Weekend Food Orders',
          description: 'High local demand for home-cooked traditional meals during weekends.',
          category: 'Cooking',
          demandLevel: 'high',
          estimatedEarningsRange: { min: 3000, max: 8000, unit: 'month' },
          requiredSkills: ['Traditional Tamil Cooking', 'Meal Prep'],
          targetCities: ['Chennai', 'Bengaluru'],
          icon: '🍲',
          seniorFriendlyNote: 'Can be done at your own pace from home.',
        },
        {
          title: 'After-School Math & Language Classes',
          description: 'Parents in your locality looking for patient home tutors for primary students.',
          category: 'Tutoring',
          demandLevel: 'high',
          estimatedEarningsRange: { min: 4000, max: 10000, unit: 'month' },
          requiredSkills: ['Tutoring', 'Mentoring'],
          targetCities: ['Chennai', 'Hyderabad'],
          icon: '📚',
          seniorFriendlyNote: 'Set your preferred batch timings (1-2 hours per day).',
        },
        {
          title: 'Festival Season Tailoring & Alterations',
          description: 'Surge in orders for custom saree blouses, falls, and designer necklines.',
          category: 'Tailoring',
          demandLevel: 'trending',
          estimatedEarningsRange: { min: 5000, max: 12000, unit: 'month' },
          requiredSkills: ['Blouse Stitching', 'Embroidery'],
          targetCities: ['Chennai', 'Bengaluru', 'Hyderabad'],
          icon: '🧵',
          seniorFriendlyNote: 'Accept only the number of orders you are comfortable fulfilling.',
        },
      ];
    }

    return sendSuccess(res, opps, 'Personalized opportunity recommendations');
  } catch (error) {
    next(error);
  }
};

