/**
 * DSCG Wedding Websites - Site 1 Portal Configuration
 * Centralized registry of destination URLs for the 5-site ecosystem.
 *
 * Update these constants once the Netlify deployment URLs for Sites 2-5 are generated.
 * Placeholders are safely detected to provide an informative preview modal rather than
 * navigating to broken or unconfigured links.
 */

export const CONFIG = {
  // Site 2: Wedding Essential Demo (★★★)
  ESSENTIAL_DEMO_URL: 'https://wedding-essential-demo.netlify.app',

  // Site 3: Wedding Website Demo (★★★★)
  WEDDING_WEBSITE_DEMO_URL: 'https://wedding-website-demo-960.netlify.app',

  // Site 4: Wedding Weekend / Destination Demo (★★★★★)
  WEEKEND_DESTINATION_DEMO_URL: 'https://wedding-weekend-destination-demo.netlify.app',

  // Site 5: DSCG Wedding Intake Application
  WEDDING_INTAKE_URL: 'https://websites-intake.darkstarconsultinggroup.com/intake',

  // Metadata
  COMPANY_NAME: 'Dark Star Consulting Group',
  SERVICE_NAME: 'DSCG Wedding Websites',
  PARENT_CAPABILITY: 'Web Design / Website Development',
  CONTACT_EMAIL: 'darkstar@darkstarconsultinggroup.com',
  PRICING: {
    ESSENTIAL: 495,
    WEBSITE: 795,
    WEEKEND_DESTINATION: 1195,
  }
};

/**
 * Validates whether an external URL is properly configured.
 * @param {string} url
 * @returns {boolean}
 */
export function isUrlConfigured(url) {
  return typeof url === 'string' && url.trim().length > 0 && url.startsWith('http');
}
