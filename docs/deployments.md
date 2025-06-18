# Deployment Tools

This document provides detailed information about the deployment-related tools available in the Vercel MCP integration.

## Available Tools

### `vercel-list-all-deployments`

List deployments under the authenticated user or team.

**Inputs:**
- `app` (string): Filter by deployment name
- `projectId` (string): Filter by project ID/name  
- `state` (string): Filter by state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED)
- `target` (string): Filter by environment (production/preview)
- `limit` (number): Number of deployments to return

**Returns:** Array of deployment objects with status, URLs, and metadata

**Example:**
```javascript
const response = await mcpClient.callTool({
  name: "vercel-list-all-deployments",
  args: {
    limit: 5,
    target: "production"
  }
});
```

### `vercel-get-deployment`

Get detailed information about a specific deployment.

**Inputs:**
- `idOrUrl` (string, required): Deployment ID or URL
- `teamId` (string): Team ID for request scoping

**Returns:** Full deployment details including build logs, domains, and environment variables

**Example:**
```javascript
const deployment = await mcpClient.callTool({
  name: "vercel-get-deployment", 
  args: {
    idOrUrl: "dpl_5WJWYSyB7BpgTj3EuwF37WMRBXBtPQ2iTMJHJBJyRfd"
  }
});
```

### `vercel-list-deployment-files`

List all files of a Vercel deployment.

**Inputs:**
- `id` (string, required): The unique deployment identifier
- `teamId` (string): Team identifier to perform the request on behalf of
- `slug` (string): Team slug to perform the request on behalf of

**Returns:** Array of file objects with properties like name, type, MIME content type, and file permissions

**Example:**
```javascript
const files = await mcpClient.callTool({
  name: "vercel-list-deployment-files",
  args: {
    id: "dpl_5WJWYSyB7BpgTj3EuwF37WMRBXBtPQ2iTMJHJBJyRfd",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l" // Optional
  }
});
```

### `vercel-create-deployment`

Create a new Vercel deployment using the v13/deployments API endpoint.

**Inputs:**

**Identification Parameters:**
- `name` (string): Deployment/project name
- `project` (string): Project ID/name (required unless deploymentId is provided)
- `deploymentId` (string): ID of a previous deployment to redeploy (required unless project is provided)
- `slug` (string): A unique URL-friendly identifier
- `teamId` (string): Team ID for scoping
- `customEnvironmentSlugOrId` (string): Custom environment slug or ID

**Configuration Parameters:**
- `target` (string): Environment (production/preview/development, default: production)
- `regions` (string[]): Deployment regions
- `functions` (object): Serverless functions configuration
- `routes` (array): Array of route definitions
- `cleanUrls` (boolean): Enable or disable Clean URLs
- `trailingSlash` (boolean): Enable or disable trailing slashes
- `public` (boolean): Make the deployment public
- `ignoreCommand` (string): Command to check whether files should be ignored

**Source Control Parameters:**
- `gitSource` (object): Git source information
  - `type` (string): Git provider type (github/gitlab/bitbucket)
  - `repoId` (string/number): Repository ID
  - `ref` (string): Git reference (branch/tag)
  - `sha` (string): Git commit SHA
- `gitMetadata` (object): Git metadata for the deployment
  - `commitAuthorName` (string): Commit author name
  - `commitMessage` (string): Commit message
  - `commitRef` (string): Git reference
  - `commitSha` (string): Commit SHA
  - `remoteUrl` (string): Git remote URL
  - `dirty` (boolean): If the working directory has uncommitted changes
- `projectSettings` (object): Project-specific settings
  - `buildCommand` (string): Custom build command
  - `devCommand` (string): Custom development command
  - `framework` (string): Framework preset
  - `installCommand` (string): Custom install command
  - `outputDirectory` (string): Build output directory
  - `rootDirectory` (string): Project root directory
  - `nodeVersion` (string): Node.js version
  - `serverlessFunctionRegion` (string): Region for serverless functions
- `meta` (object): Additional metadata for the deployment
- `monorepoManager` (string): Monorepo manager (turborepo, nx, etc.)

**File Parameters (for non-git deployments):**
- `files` (array): Files to deploy
  - `file` (string): File path
  - `data` (string): File content
  - `encoding` (string): Content encoding (base64/utf-8)

**Other Flags:**
- `forceNew` (boolean): Force new deployment even if identical exists
- `withCache` (boolean): Enable or disable build cache
- `autoAssignCustomDomains` (boolean): Automatically assign custom domains
- `withLatestCommit` (boolean): Include the latest commit in the deployment

**Returns:** Created deployment details with status URLs, build information, and access links

**Examples:**

Basic deployment:
```javascript
const basicDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    project: "my-project-id",
    target: "production",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l" // Optional
  }
});
```

Redeploy existing deployment:
```javascript
const redeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    deploymentId: "dpl_123abc456def"
  }
});
```

Git-based deployment:
```javascript
const gitDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    project: "my-project-id",
    gitSource: {
      type: "github",
      ref: "main"
    },
    gitMetadata: {
      commitMessage: "add method to measure Interaction to Next Paint",
      commitAuthorName: "developer",
      remoteUrl: "https://github.com/vercel/next.js"
    }
  }
});
```

File-based deployment:
```javascript
const fileDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    name: "my-instant-deployment",
    project: "my-deployment-project", 
    files: [
      {
        file: "index.html",
        data: "PGgxPkhlbGxvIFdvcmxkPC9oMT4=", // Base64 encoded <h1>Hello World</h1>
        encoding: "base64"
      }
    ],
    projectSettings: {
      framework: "nextjs",
      buildCommand: "next build",
      installCommand: "npm install",
      nodeVersion: "18.x"
    }
  }
});
```