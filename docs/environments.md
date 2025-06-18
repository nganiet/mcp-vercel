# Environment Tools

This document provides detailed information about the environment-related tools available in the Vercel MCP integration.

## Available Tools

### `vercel-get-environments`

Retrieve environment variables for a project by ID or name.

**Inputs:**
- `idOrName` (string, required): The project ID or name to retrieve environment variables for

**Returns:** Array of environment variables with their configuration

**Example:**
```javascript
const environments = await mcpClient.callTool({
  name: "vercel-get-environments",
  args: {
    idOrName: "my-project-id"
  }
});
```

### `vercel-create-custom-environment`

Create a custom environment for a Vercel project. Custom environments cannot be named 'Production' or 'Preview'.

**Inputs:**
- `idOrName` (string, required): The unique project identifier or project name
- `name` (string, required): Name for the custom environment (cannot be 'Production' or 'Preview')
- `description` (string): Description of the custom environment
- `branchMatcher` (object): Branch matching configuration
  - `type` (string): Type of branch matching (startsWith/endsWith/contains/exactMatch/regex)
  - `pattern` (string): Pattern to match branches against
- `teamId` (string): Team ID to perform the request on behalf of
- `slug` (string): Team slug to perform the request on behalf of

**Returns:** Created custom environment details including ID, slug, type, description, branch matcher configuration, and domains

**Example:**
```javascript
const customEnv = await mcpClient.callTool({
  name: "vercel-create-custom-environment",
  args: {
    idOrName: "my-project-id",
    name: "staging",
    description: "Staging environment for QA testing",
    branchMatcher: {
      type: "startsWith",
      pattern: "staging/"
    },
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l" // Optional
  }
});
```

## Environment Types

Vercel supports three default environment types:
- **Production**: The main production environment
- **Preview**: Preview deployments for branches and pull requests
- **Development**: Local development environment

Custom environments allow you to create additional deployment targets with specific branch matching rules and configurations.