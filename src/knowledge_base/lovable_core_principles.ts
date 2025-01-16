export const lovableKnowledgeBase = {
  corePrinciples: {
    empowermentThroughSimplicity: {
      goal: "Make complex technology accessible and usable by non-technical users",
      implementation: [
        "Intuitive user interfaces with drag-and-drop workflow builders",
        "Guided wizards for complex tasks",
        "Contextual help and tooltips for every feature",
        "AI-assisted prompts and suggestions"
      ]
    },
    scalabilityFirst: {
      goal: "Ensure the platform grows seamlessly with users' needs",
      implementation: [
        "Modular architecture for workflows and API integrations",
        "Cloud-based infrastructure for distributed processing",
        "Automatic resource scaling based on demand",
        "Efficient caching and optimization strategies"
      ]
    },
    collaborationFocus: {
      goal: "Foster a community-driven ecosystem",
      implementation: [
        "Real-time multi-user collaboration features",
        "Marketplace for sharing and selling custom workflows",
        "Community forums and discussion boards",
        "Rewards system for valuable contributions"
      ]
    }
  },
  
  platformFeatures: {
    workflowBuilder: {
      purpose: "Allow users to create, manage, and optimize workflows",
      features: [
        "Drag-and-drop interface for workflow design",
        "Pre-built templates for common use cases",
        "AI suggestions for workflow optimization",
        "Real-time preview and testing capabilities"
      ]
    },
    apiIntegrations: {
      purpose: "Connect with third-party services seamlessly",
      features: [
        "Pre-integrated APIs for various industries",
        "Middleware for data transformation",
        "Authentication and security handling",
        "Usage monitoring and analytics"
      ]
    },
    intelligentAssistants: {
      purpose: "Provide proactive support and insights",
      features: [
        "AI-driven suggestions based on user behavior",
        "Predictive analytics for optimization",
        "Contextual troubleshooting assistance",
        "Natural language processing for commands"
      ]
    }
  },

  bestPractices: {
    codeOrganization: [
      "Create small, focused components (50 lines or less)",
      "Use TypeScript for type safety",
      "Follow consistent naming conventions",
      "Implement proper error handling"
    ],
    userExperience: [
      "Always design responsive interfaces",
      "Use toasts for important notifications",
      "Leverage shadcn/ui components",
      "Maintain consistent styling with Tailwind"
    ],
    performance: [
      "Implement proper caching strategies",
      "Optimize API calls and data fetching",
      "Use connection pooling for databases",
      "Monitor and log performance metrics"
    ],
    security: [
      "Follow security best practices for API keys",
      "Implement proper authentication flows",
      "Use environment variables for sensitive data",
      "Regular security audits and updates"
    ]
  },

  developmentGuidelines: {
    componentCreation: {
      rules: [
        "Create new files for each component",
        "Keep components small and focused",
        "Use proper TypeScript types",
        "Document component props"
      ]
    },
    stateManagement: {
      recommendations: [
        "Use React Query for server state",
        "Implement proper loading states",
        "Handle errors gracefully",
        "Optimize re-renders"
      ]
    },
    testing: {
      approaches: [
        "Write unit tests for critical functions",
        "Implement integration tests",
        "Use proper test coverage",
        "Regular performance testing"
      ]
    }
  }
};

export const getLovableGuideline = (
  category: keyof typeof lovableKnowledgeBase,
  subcategory: string
) => {
  return lovableKnowledgeBase[category]?.[subcategory] || null;
};