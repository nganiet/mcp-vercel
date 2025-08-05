#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { VERCEL_TOOLS } from "./constants/tools.js";
import {
  handleAllDeployments,
  handleCreateDeployment,
  handleGetDeployment,
  handleListDeploymentFiles,
} from "./tools/deployments/handlers.js";
import {
  handleCreateProject,
  handleCreateEnvironmentVariables,
  handleListProjects,
  handleFindProject,
  handleGetProjectDomain,
  handleDeleteProject,
  handleRemoveEnvironmentVariable,
} from "./tools/projects/handlers.js";
import { handleGetEnvironments, handleCreateCustomEnvironment } from "./tools/environments/handlers.js";
import { handleListTeams, handleCreateTeam } from "./tools/teams/handlers.js";

const server = new Server(
  {
    name: "vercel",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  },
);

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: VERCEL_TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, args } = request.params;
    switch (name) {
      case "vercel-list-all-deployments":
        return await handleAllDeployments(args);
      case "vercel-get-environments":
        return await handleGetEnvironments(request.params as any);
      case "vercel-get-deployment":
        return await handleGetDeployment(args);
      case "vercel-list-deployment-files":
        return await handleListDeploymentFiles(args);
      case "vercel-create-deployment":
        return await handleCreateDeployment(args);
      case "vercel-create-project":
        return await handleCreateProject(args);
      case "vercel-list-all-teams":
        return await handleListTeams(args);
      case "vercel-create-team":
        return await handleCreateTeam(args);
      case "vercel-create-environment-variables":
        return await handleCreateEnvironmentVariables(args);
      case "vercel-create-custom-environment":
        return await handleCreateCustomEnvironment(args);
      case "vercel-list-projects":
        return await handleListProjects(args);
      case "vercel-find-project":
        return await handleFindProject(args);
      case "vercel-get-project-domain":
        return await handleGetProjectDomain(args);
      case "vercel-delete-project":
        return await handleDeleteProject(args);
      case "vercel-remove-environment-variable":
        return await handleRemoveEnvironmentVariable(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
          isError: true,
        },
      ],
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Vercel MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
