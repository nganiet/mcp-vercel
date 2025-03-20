#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { VERCEL_TOOLS } from "./constants/tools.js";
import { handleAllDeployments } from "./tools/deployments/handlers.js";
import { handleGetEnvironments } from "./tools/environments/handlers.js";

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
