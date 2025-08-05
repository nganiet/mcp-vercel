# Project Tools

This document provides detailed information about the project-related tools available in the Vercel MCP integration.

## Available Tools

### `vercel-create-project`

Create a new Vercel project.

**Inputs:**
- `name` (string, required): Project name
- `framework` (string): Framework preset
- `buildCommand` (string): Custom build command
- `devCommand` (string): Custom dev command
- `installCommand` (string): Custom install command
- `outputDirectory` (string): Build output directory
- `publicSource` (boolean): Make project public
- `rootDirectory` (string): Root directory
- `serverlessFunctionRegion` (string): Serverless function region
- `skipGitConnectDuringLink` (boolean): Skip Git connection
- `teamId` (string): Team ID for scoping

**Returns:** Project configuration with deployment settings

**Example:**
```javascript
const project = await mcpClient.callTool({
  name: "vercel-create-project",
  args: {
    name: "my-awesome-project",
    framework: "nextjs",
    buildCommand: "next build",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l"
  }
});
```

### `vercel-list-projects`

List all projects under the authenticated user or team.

**Inputs:**
- `limit` (number): Maximum number of projects to return
- `from` (number): Projects created/updated after this timestamp
- `teamId` (string): Team ID for request scoping
- `search` (string): Search projects by name
- `repoUrl` (string): Filter by repository URL
- `gitForkProtection` (string): Specify PR authorization from forks (0/1)

**Returns:** List of project objects with metadata including:
- `id`: Project ID
- `name`: Project name
- `framework`: Associated framework
- `latestDeployments`: Array of recent deployments
- `createdAt`: Creation timestamp
- Additional properties like targets, accountId, etc.

**Example:**
```javascript
const projects = await mcpClient.callTool({
  name: "vercel-list-projects",
  args: {
    limit: 10,
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
    search: "my-app" // Optional
  }
});
```

### `vercel-find-project`

Find a specific Vercel project by its ID or name.

**Inputs:**
- `idOrName` (string, required): The project ID or name to find
- `teamId` (string): Team ID for request scoping

**Returns:** Detailed project information including:
- `id`: Project ID
- `name`: Project name
- `accountId`: Account ID
- `framework`: Framework configuration
- `env`: Environment variables
- `buildCommand`: Build command
- `devCommand`: Development command
- `installCommand`: Install command
- `outputDirectory`: Output directory
- `publicSource`: Whether the project is public
- `rootDirectory`: Root directory
- `serverlessFunctionRegion`: Serverless function region
- `nodeVersion`: Node.js version
- `directoryListing`: Directory listing setting
- `passwordProtection`: Password protection configuration

**Example:**
```javascript
const project = await mcpClient.callTool({
  name: "vercel-find-project",
  args: {
    idOrName: "my-project-name", // Can use either project ID or name
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l" // Optional
  }
});
```

### `vercel-create-environment-variables`

Create multiple environment variables for a project.

**Inputs:**
- `projectId` (string, required): Target project ID
- `teamId` (string): Team ID for request scoping
- `environmentVariables` (array, required): Environment variables to create
  - `key` (string, required): Variable name
  - `value` (string, required): Variable value
  - `target` (string[], required): Deployment targets (production/preview/development)
  - `type` (string, required): Variable type (system/encrypted/plain/sensitive)
  - `gitBranch` (string): Optional git branch for variable

**Returns:** Object with created variables and any skipped entries

**Example:**
```javascript
const envVars = await mcpClient.callTool({
  name: "vercel-create-environment-variables",
  args: {
    projectId: "prj_123abc",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l",
    environmentVariables: [
      {
        key: "API_KEY",
        value: "secret-api-key",
        target: ["production", "preview"],
        type: "encrypted"
      },
      {
        key: "DATABASE_URL",
        value: "postgresql://...",
        target: ["production"],
        type: "sensitive"
      }
    ]
  }
});
```

### `vercel-get-project-domain`

Get information about a specific domain within a Vercel project.

**Inputs:**
- `idOrName` (string, required): The project ID or name
- `domain` (string, required): The domain name (e.g., www.example.com)
- `teamId` (string): Team ID for request scoping
- `slug` (string): Team slug for request scoping

**Returns:** Domain configuration details including:
- `name`: The domain name
- `apexName`: The apex domain
- `projectId`: Associated project ID
- `redirect`: Redirect URL if configured
- `redirectStatusCode`: HTTP status code for redirects
- `gitBranch`: Associated git branch
- `customEnvironmentId`: Custom environment ID if applicable
- `verified`: Whether the domain is verified
- `verification`: Array of verification records
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Example:**
```javascript
const domain = await mcpClient.callTool({
  name: "vercel-get-project-domain",
  args: {
    idOrName: "my-project-id",
    domain: "www.example.com",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l" // Optional
  }
});
```

### `vercel-delete-project`

Delete a Vercel project by its ID or name.

**Inputs:**
- `idOrName` (string, required): The project ID or name to delete
- `teamId` (string): Team ID for request scoping
- `slug` (string): Team slug for request scoping

**Returns:** Success message upon deletion

**Example:**
```javascript
const result = await mcpClient.callTool({
  name: "vercel-delete-project",
  args: {
    idOrName: "prj_123abc",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l"
  }
});
```

### `vercel-remove-environment-variable`

Remove an environment variable from a Vercel project.

**Inputs:**
- `idOrName` (string, required): The project ID or name
- `id` (string, required): The environment variable ID to remove
- `customEnvironmentId` (string): Custom environment ID
- `teamId` (string): Team ID for request scoping
- `slug` (string): Team slug for request scoping

**Returns:** Success message and the removed environment variable details

**Example:**
```javascript
const result = await mcpClient.callTool({
  name: "vercel-remove-environment-variable",
  args: {
    idOrName: "prj_123abc",
    id: "env_456def",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l"
  }
});
```
