import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const VERCEL_ALL_DEPLOYMENTS_TOOL: Tool = {
  name: "vercel-list-all-deployments",
  description: "List deployments under the authenticated user or team.",
  inputSchema: {
    type: "object",
    properties: {
      app: {
        type: "string",
        description: "Name of the deployment",
      },
      limit: {
        type: "number",
        description: "Number of deployments to return",
      },
      projectId: {
        type: "string",
        description: "Filter deployments from the given ID or name",
      },
      state: {
        type: "string",
        description:
          "Filter deployments based on their state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED)",
      },
      target: {
        type: "string",
        description: "Filter deployments based on the environment",
      },
    },
  },
};

export const VERCEL_GET_ENVIRONMENTS_TOOL: Tool = {
  name: "vercel-get-environments",
  description: "Retrieve environment variables for a project by ID or name",
  inputSchema: {
    type: "object",
    properties: {
      idOrName: {
        type: "string",
        description:
          "The project ID or name to retrieve environment variables for",
      },
    },
    required: ["idOrName"],
  },
};

export const VERCEL_GET_DEPLOYMENT_TOOL: Tool = {
  name: "vercel-get-deployment",
  description: "Get a deployment by its ID or URL",
  inputSchema: {
    type: "object",
    properties: {
      idOrUrl: {
        type: "string",
        description: "ID or URL of the deployment to retrieve",
      },
      teamId: {
        type: "string",
        description: "Team ID to scope the request",
      },
    },
    required: ["idOrUrl"],
  },
};

export const VERCEL_LIST_DEPLOYMENT_FILES_TOOL: Tool = {
  name: "vercel-list-deployment-files",
  description: "List all files of a Vercel deployment",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The unique deployment identifier",
      },
      teamId: {
        type: "string",
        description: "Team identifier to perform the request on behalf of",
      },
      slug: {
        type: "string",
        description: "Team slug to perform the request on behalf of",
      },
    },
    required: ["id"],
  },
};

export const VERCEL_CREATE_DEPLOYMENT_TOOL: Tool = {
  name: "vercel-create-deployment",
  description: "Create a new Vercel deployment with the v13/deployments API",
  inputSchema: {
    type: "object",
    properties: {
      // Identification parameters
      name: {
        type: "string",
        description: "Name of the deployment/project",
      },
      project: {
        type: "string",
        description: "Project ID or name (required unless deploymentId is provided)",
      },
      deploymentId: {
        type: "string",
        description: "ID of a previous deployment to redeploy (required unless project is provided)",
      },
      slug: {
        type: "string",
        description: "A unique URL-friendly identifier",
      },
      teamId: {
        type: "string",
        description: "Team ID for scoping",
      },
      customEnvironmentSlugOrId: {
        type: "string",
        description: "Custom environment slug or ID",
      },
      
      // Configuration parameters
      target: {
        type: "string",
        description: "Deployment target environment",
        enum: ["production", "preview", "development"],
        default: "production"
      },
      regions: {
        type: "array",
        items: { type: "string" },
        description: "Regions to deploy to",
      },
      functions: {
        type: "object",
        description: "Serverless functions configuration"
      },
      routes: {
        type: "array",
        description: "Array of route definitions"
      },
      cleanUrls: {
        type: "boolean",
        description: "Enable or disable Clean URLs"
      },
      trailingSlash: {
        type: "boolean",
        description: "Enable or disable trailing slashes"
      },
      public: {
        type: "boolean",
        description: "Make the deployment public"
      },
      ignoreCommand: {
        type: "string",
        description: "Command to check whether files should be ignored"
      },
      
      // Source control parameters
      gitSource: {
        type: "object",
        description: "Git source information",
        properties: {
          type: {
            type: "string",
            enum: ["github", "gitlab", "bitbucket"],
            description: "Git provider type"
          },
          repoId: {
            type: ["string", "number"],
            description: "Repository ID"
          },
          ref: {
            type: "string",
            description: "Git reference (branch/tag)"
          },
          sha: {
            type: "string",
            description: "Git commit SHA"
          }
        }
      },
      gitMetadata: {
        type: "object",
        description: "Git metadata for the deployment",
        properties: {
          commitAuthorName: {
            type: "string",
            description: "Commit author name"
          },
          commitMessage: {
            type: "string",
            description: "Commit message"
          },
          commitRef: {
            type: "string",
            description: "Commit reference"
          },
          commitSha: {
            type: "string",
            description: "Commit SHA"
          },
          remoteUrl: {
            type: "string",
            description: "Git remote URL"
          },
          dirty: {
            type: "boolean",
            description: "Indicates if the working directory has uncommitted changes"
          }
        }
      },
      projectSettings: {
        type: "object",
        description: "Project-specific settings",
        properties: {
          buildCommand: {
            type: "string",
            description: "Custom build command"
          },
          devCommand: {
            type: "string",
            description: "Custom development command"
          },
          installCommand: {
            type: "string",
            description: "Custom install command"
          },
          outputDirectory: {
            type: "string",
            description: "Directory where build output is located"
          },
          rootDirectory: {
            type: "string",
            description: "Directory where the project is located"
          },
          framework: {
            type: "string",
            description: "Framework preset"
          },
          nodeVersion: {
            type: "string",
            description: "Node.js version"
          },
          serverlessFunctionRegion: {
            type: "string",
            description: "Region for serverless functions"
          },
          skipGitConnectDuringLink: {
            type: "boolean",
            description: "Skip Git connection during project link"
          }
        }
      },
      meta: {
        type: "object",
        description: "Additional metadata for the deployment"
      },
      monorepoManager: {
        type: "string",
        description: "Monorepo manager (e.g., turborepo, nx)"
      },
      
      // File upload (for non-git deployments)
      files: {
        type: "array",
        description: "Files to deploy (for non-git deployments)",
        items: {
          type: "object",
          properties: {
            file: {
              type: "string",
              description: "File path"
            },
            data: {
              type: "string",
              description: "File content"
            },
            encoding: {
              type: "string",
              enum: ["base64", "utf-8"],
              description: "File content encoding"
            }
          }
        }
      },
      
      // Other flags
      forceNew: {
        type: "boolean",
        description: "Force new deployment even if identical exists",
      },
      withCache: {
        type: "boolean",
        description: "Enable or disable build cache"
      },
      autoAssignCustomDomains: {
        type: "boolean",
        description: "Automatically assign custom domains to the deployment"
      },
      withLatestCommit: {
        type: "boolean",
        description: "Include the latest commit in the deployment"
      }
    },
  },
};

export const VERCEL_LIST_TEAMS_TOOL: Tool = {
  name: "vercel-list-all-teams",
  description: "List all teams under the authenticated account",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Maximum number of teams to return",
      },
      since: {
        type: "number",
        description:
          "Timestamp in milliseconds to get teams created after this time",
      },
      until: {
        type: "number",
        description:
          "Timestamp in milliseconds to get teams created before this time",
      },
      teamId: {
        type: "string",
        description: "Team ID to scope the request",
      },
    },
  },
};

export const VERCEL_CREATE_TEAM_TOOL: Tool = {
  name: "vercel-create-team",
  description: "Create a new Vercel team",
  inputSchema: {
    type: "object",
    properties: {
      slug: {
        type: "string",
        description: "A unique identifier for the team",
      },
      name: {
        type: "string",
        description: "A display name for the team",
      },
    },
    required: ["slug"],
  },
};

export const VERCEL_CREATE_PROJECT_TOOL: Tool = {
  name: "vercel-create-project",
  description: "Create a new Vercel project",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the project",
      },
      framework: {
        type: "string",
        description: "Framework preset",
      },
      buildCommand: {
        type: "string",
        description: "Build command",
      },
      devCommand: {
        type: "string",
        description: "Development command",
      },
      installCommand: {
        type: "string",
        description: "Install command",
      },
      outputDirectory: {
        type: "string",
        description: "Output directory",
      },
      publicSource: {
        type: "boolean",
        description: "Make project public",
      },
      rootDirectory: {
        type: "string",
        description: "Root directory",
      },
      serverlessFunctionRegion: {
        type: "string",
        description: "Serverless function region",
      },
      skipGitConnectDuringLink: {
        type: "boolean",
        description: "Skip Git connection",
      },
      teamId: {
        type: "string",
        description: "Team ID for scoping",
      },
    },
    required: ["name"],
  },
};

export const VERCEL_LIST_PROJECTS_TOOL: Tool = {
  name: "vercel-list-projects",
  description: "List all projects under the authenticated user or team",
  inputSchema: {
    type: "object",
    properties: {
      limit: {
        type: "number",
        description: "Maximum number of projects to return"
      },
      from: {
        type: "number",
        description: "Projects created/updated after this timestamp"
      },
      teamId: {
        type: "string",
        description: "Team ID for request scoping"
      },
      search: {
        type: "string",
        description: "Search projects by name"
      },
      repoUrl: {
        type: "string",
        description: "Filter by repository URL"
      },
      gitForkProtection: {
        type: "string",
        enum: ["0", "1"],
        description: "Specify PR authorization from forks (0/1)"
      }
    }
  }
};

export const VERCEL_CREATE_ENVIRONMENT_VARIABLES_TOOL: Tool = {
  name: "vercel-create-environment-variables",
  description: "Create environment variables for a Vercel project",
  inputSchema: {
    type: "object",
    properties: {
      projectId: {
        type: "string",
        description: "Project ID to create environment variables for",
      },
      teamId: {
        type: "string",
        description: "Team ID for scoping",
      },
      environmentVariables: {
        type: "array",
        description: "Array of environment variables to create",
        items: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description: "Environment variable key name",
            },
            value: {
              type: "string",
              description: "Environment variable value",
            },
            target: {
              type: "array",
              items: {
                type: "string",
                enum: ["production", "preview", "development"],
              },
              description: "Target environments for this variable",
            },
            type: {
              type: "string",
              enum: ["system", "encrypted", "plain", "sensitive"],
              description: "Type of environment variable",
            },
            gitBranch: {
              type: "string",
              description: "Git branch to apply this variable to (optional)",
            },
          },
          required: ["key", "value", "target", "type"],
        },
      },
    },
    required: ["projectId", "environmentVariables"],
  },
};

export const VERCEL_CREATE_CUSTOM_ENVIRONMENT_TOOL: Tool = {
  name: "vercel-create-custom-environment",
  description: "Create a custom environment for a Vercel project. Note: Cannot be named 'Production' or 'Preview'",
  inputSchema: {
    type: "object",
    properties: {
      idOrName: {
        type: "string",
        description: "The unique project identifier or project name",
      },
      name: {
        type: "string",
        description: "Name for the custom environment (cannot be 'Production' or 'Preview')",
      },
      description: {
        type: "string",
        description: "Description of the custom environment",
      },
      branchMatcher: {
        type: "object",
        description: "Branch matching configuration for the custom environment",
        properties: {
          type: {
            type: "string",
            enum: ["startsWith", "endsWith", "contains", "exactMatch", "regex"],
            description: "Type of branch matching"
          },
          pattern: {
            type: "string",
            description: "Pattern to match branches against"
          }
        }
      },
      teamId: {
        type: "string",
        description: "Team ID to perform the request on behalf of",
      },
      slug: {
        type: "string",
        description: "Team slug to perform the request on behalf of",
      },
    },
    required: ["idOrName", "name"],
  },
};

export const VERCEL_FIND_PROJECT_TOOL: Tool = {
  name: "vercel-find-project",
  description: "Find a Vercel project by its ID or name",
  inputSchema: {
    type: "object",
    properties: {
      idOrName: {
        type: "string",
        description: "The project ID or name to find",
      },
      teamId: {
        type: "string",
        description: "Team ID for request scoping",
      },
    },
    required: ["idOrName"],
  },
};

export const VERCEL_GET_PROJECT_DOMAIN_TOOL: Tool = {
  name: "vercel-get-project-domain",
  description: "Get information about a specific domain within a Vercel project",
  inputSchema: {
    type: "object",
    properties: {
      idOrName: {
        type: "string",
        description: "The project ID or name",
      },
      domain: {
        type: "string",
        description: "The domain name (e.g., www.example.com)",
      },
      teamId: {
        type: "string",
        description: "Team ID for request scoping",
      },
      slug: {
        type: "string",
        description: "Team slug for request scoping",
      },
    },
    required: ["idOrName", "domain"],
  },
};

export const VERCEL_DELETE_PROJECT_TOOL: Tool = {
  name: "vercel-delete-project",
  description: "Delete a Vercel project by its ID or name",
  inputSchema: {
    type: "object",
    properties: {
      idOrName: {
        type: "string",
        description: "The project ID or name to delete",
      },
      teamId: {
        type: "string",
        description: "Team ID for request scoping",
      },
      slug: {
        type: "string",
        description: "Team slug for request scoping",
      },
    },
    required: ["idOrName"],
  },
};

export const VERCEL_REMOVE_ENVIRONMENT_VARIABLE_TOOL: Tool = {
  name: "vercel-remove-environment-variable",
  description: "Remove an environment variable from a Vercel project",
  inputSchema: {
    type: "object",
    properties: {
      idOrName: {
        type: "string",
        description: "The project ID or name",
      },
      id: {
        type: "string",
        description: "The environment variable ID to remove",
      },
      customEnvironmentId: {
        type: "string",
        description: "Custom environment ID",
      },
      teamId: {
        type: "string",
        description: "Team ID for request scoping",
      },
      slug: {
        type: "string",
        description: "Team slug for request scoping",
      },
    },
    required: ["idOrName", "id"],
  },
};

export const VERCEL_TOOLS = [
  VERCEL_DELETE_PROJECT_TOOL,
  VERCEL_REMOVE_ENVIRONMENT_VARIABLE_TOOL,
  VERCEL_ALL_DEPLOYMENTS_TOOL,
  VERCEL_GET_ENVIRONMENTS_TOOL,
  VERCEL_GET_DEPLOYMENT_TOOL,
  VERCEL_LIST_DEPLOYMENT_FILES_TOOL,
  VERCEL_CREATE_DEPLOYMENT_TOOL,
  VERCEL_CREATE_PROJECT_TOOL,
  VERCEL_LIST_TEAMS_TOOL,
  VERCEL_CREATE_TEAM_TOOL,
  VERCEL_CREATE_ENVIRONMENT_VARIABLES_TOOL,
  VERCEL_CREATE_CUSTOM_ENVIRONMENT_TOOL,
  VERCEL_LIST_PROJECTS_TOOL,
  VERCEL_FIND_PROJECT_TOOL,
  VERCEL_GET_PROJECT_DOMAIN_TOOL,
] as const;
