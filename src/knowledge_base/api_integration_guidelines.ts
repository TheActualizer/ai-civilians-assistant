export const apiIntegrationGuidelines = {
  supabase: {
    edgeFunctions: {
      bestPractices: [
        "Always use proper CORS headers",
        "Implement proper error handling",
        "Use TypeScript for type safety",
        "Add comprehensive logging"
      ],
      limitations: [
        "150MB memory limit",
        "60 second timeout",
        "POST-only requests",
        "Restricted outbound ports"
      ],
      security: [
        "Store secrets in Supabase Vault",
        "Implement proper authentication",
        "Use role-based access control",
        "Regular security audits"
      ]
    },
    database: {
      bestPractices: [
        "Use proper types for columns",
        "Implement RLS policies",
        "Optimize queries for performance",
        "Regular backups and maintenance"
      ],
      security: [
        "Never expose sensitive data",
        "Use proper access controls",
        "Encrypt sensitive information",
        "Regular security reviews"
      ]
    }
  },
  
  externalApis: {
    integration: {
      steps: [
        "Validate API documentation",
        "Test rate limits and quotas",
        "Implement proper error handling",
        "Monitor API health"
      ],
      security: [
        "Store API keys securely",
        "Implement proper authentication",
        "Regular security audits",
        "Monitor for suspicious activity"
      ]
    }
  }
};

export const getApiGuideline = (
  category: keyof typeof apiIntegrationGuidelines,
  subcategory: string
) => {
  return apiIntegrationGuidelines[category]?.[subcategory] || null;
};