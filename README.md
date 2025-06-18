# Vercel MCP Integration

A Model Context Protocol (MCP) integration for Vercel's REST API, providing programmatic access to Vercel deployment management through AI Assistants like Claude and Cursor.

## 📋 Overview <sub><sup>Last updated: May 2025</sup></sub>

This MCP server implements Vercel's core API endpoints as tools, enabling:

- Deployment monitoring & management
- Environment variable retrieval
- Project deployment status tracking
- Team creation and management
- CI/CD pipeline integration

## ✨ Features

### Current Tools

- `vercel-list-all-deployments` - List deployments with filtering
- `vercel-get-deployment` - Retrieve specific deployment details
- `vercel-list-deployment-files` - List files in a deployment
- `vercel-create-deployment` - Create new deployments
- `vercel-create-project` - Create new Vercel projects
- `vercel-create-environment-variables` - Create multiple environment variables
- `vercel-get-environments` - Access project environment variables
- `vercel-create-custom-environment` - Create custom environments for projects
- `vercel-list-projects` - List all projects with pagination
- `vercel-find-project` - Find a specific project by ID or name
- `vercel-get-project-domain` - Get information about a specific domain within a project
- `vercel-list-all-teams` - List all accessible teams
- `vercel-create-team` - Create a new team with custom slug and name

## 🛣️ Roadmap

- [x] Deployment creation workflow
- [x] Project management tools
- [x] Team management integration (List & Create teams)
- [ ] Real-time deployment monitoring
- [x] Advanced error handling
- [ ] Deployment metrics dashboard

## Tools

### `vercel-list-all-deployments`

List deployments under the authenticated user or team

- **Inputs**:
  - `app` (string): Filter by deployment name
  - `projectId` (string): Filter by project ID/name
  - `state` (string): Filter by state (BUILDING, ERROR, INITIALIZING, QUEUED, READY, CANCELED)
  - `target` (string): Filter by environment (production/preview)
  - `limit` (number): Number of deployments to return
- **Returns**: Array of deployment objects with status, URLs, and metadata

### `vercel-get-deployment`

Get detailed information about a specific deployment

- **Inputs**:
  - `idOrUrl` (string): Deployment ID or URL (required)
  - `teamId` (string): Team ID for request scoping
- **Returns**: Full deployment details including build logs, domains, and environment variables

### `vercel-list-deployment-files`

List all files of a Vercel deployment

- **Inputs**:
  - `id` (string): The unique deployment identifier (required)
  - `teamId` (string): Team identifier to perform the request on behalf of
  - `slug` (string): Team slug to perform the request on behalf of
- **Returns**: Array of file objects with properties like name, type, MIME content type, and file permissions

### `vercel-create-deployment`

Create a new Vercel deployment using the v13/deployments API endpoint

- **Inputs**:
  - **Identification Parameters**:
    - `name` (string): Deployment/project name
    - `project` (string): Project ID/name (required unless deploymentId is provided)
    - `deploymentId` (string): ID of a previous deployment to redeploy (required unless project is provided)
    - `slug` (string): A unique URL-friendly identifier
    - `teamId` (string): Team ID for scoping
    - `customEnvironmentSlugOrId` (string): Custom environment slug or ID
  - **Configuration Parameters**:
    - `target` (string): Environment (production/preview/development, default: production)
    - `regions` (string[]): Deployment regions
    - `functions` (object): Serverless functions configuration
    - `routes` (array): Array of route definitions
    - `cleanUrls` (boolean): Enable or disable Clean URLs
    - `trailingSlash` (boolean): Enable or disable trailing slashes
    - `public` (boolean): Make the deployment public
    - `ignoreCommand` (string): Command to check whether files should be ignored
  - **Source Control Parameters**:
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
  - **File Parameters (for non-git deployments)**:
    - `files` (array): Files to deploy
      - `file` (string): File path
      - `data` (string): File content
      - `encoding` (string): Content encoding (base64/utf-8)
  - **Other Flags**:
    - `forceNew` (boolean): Force new deployment even if identical exists
    - `withCache` (boolean): Enable or disable build cache
    - `autoAssignCustomDomains` (boolean): Automatically assign custom domains
    - `withLatestCommit` (boolean): Include the latest commit in the deployment
- **Returns**: Created deployment details with status URLs, build information, and access links

### `vercel-create-project`

Create a new Vercel project

- **Inputs**:
  - `name` (string): Project name (required)
  - `framework` (string): Framework preset
  - `buildCommand` (string): Custom build command
  - `devCommand` (string): Custom dev command
  - `outputDirectory` (string): Build output directory
  - `teamId` (string): Team ID for scoping
- **Returns**: Project configuration with deployment settings

### `vercel-create-environment-variables`

Create multiple environment variables for a project

- **Inputs**:

  - `projectId` (string): Target project ID (required)
  - `teamId` (string): Team ID for request scoping
  - `environmentVariables` (array): Environment variables to create
    - `key` (string): Variable name (required)
    - `value` (string): Variable value (required)
    - `target` (string[]): Deployment targets (production/preview/development)
    - `type` (string): Variable type (system/encrypted/plain/sensitive)
    - `gitBranch` (string): Optional git branch for variable

- **Returns**: Object with created variables and any skipped entries

### `vercel-create-custom-environment`

Create a custom environment for a Vercel project. Custom environments cannot be named 'Production' or 'Preview'.

- **Inputs**:
  - `idOrName` (string): The unique project identifier or project name (required)
  - `name` (string): Name for the custom environment (required, cannot be 'Production' or 'Preview')
  - `description` (string): Description of the custom environment
  - `branchMatcher` (object): Branch matching configuration
    - `type` (string): Type of branch matching (startsWith/endsWith/contains/exactMatch/regex)
    - `pattern` (string): Pattern to match branches against
  - `teamId` (string): Team ID to perform the request on behalf of
  - `slug` (string): Team slug to perform the request on behalf of
- **Returns**: Created custom environment details including ID, slug, type, description, branch matcher configuration, and domains

### `vercel-list-all-teams`

List all teams accessible to authenticated user

- **Inputs**:
  - `limit` (number): Maximum results to return
  - `since` (number): Timestamp for teams created after
  - `until` (number): Timestamp for teams created before
  - `teamId` (string): Team ID for request scoping
- **Returns**: Paginated list of team objects with metadata

### `vercel-create-team`

Create a new Vercel team

- **Inputs**:
  - `slug` (string): A unique identifier for the team (required)
  - `name` (string): A display name for the team (optional)
- **Returns**: Created team details including ID, slug, and billing information

### `vercel-list-projects`

List all projects under the authenticated user or team

- **Inputs**:
  - `limit` (number): Maximum number of projects to return
  - `from` (number): Timestamp for projects created/updated after this time
  - `teamId` (string): Team ID for request scoping
  - `search` (string): Search projects by name
  - `repoUrl` (string): Filter by repository URL
  - `gitForkProtection` (string): Specify PR authorization from forks (0/1)
- **Returns**: List of project objects with metadata including:
  - `id`: Project ID
  - `name`: Project name
  - `framework`: Associated framework
  - `latestDeployments`: Array of recent deployments
  - `createdAt`: Creation timestamp
  - Additional properties like targets, accountId, etc.

### `vercel-find-project`

Find a specific Vercel project by its ID or name

- **Inputs**:
  - `idOrName` (string): The project ID or name to find (required)
  - `teamId` (string): Team ID for request scoping
- **Returns**: Detailed project information including:
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

### `vercel-get-project-domain`

Get information about a specific domain within a Vercel project

- **Inputs**:
  - `idOrName` (string): The project ID or name (required)
  - `domain` (string): The domain name, e.g., www.example.com (required)
  - `teamId` (string): Team ID for request scoping
  - `slug` (string): Team slug for request scoping
- **Returns**: Domain configuration details including:
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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Vercel API Token
- MCP Client (Claude, Cursor, or other AI Assistants that support MCP)

### Installation

```bash
git clone [your-repo-url]
cd vercel-mcp
npm install
```

### Configuration

1. Create `.env` file:

```env
VERCEL_API_TOKEN=your_api_token_here
```

2. Start MCP server:

```bash
npm start
```

## 🔗 Integrating with AI Assistants

### Integrating with Claude

Claude supports MCP tools via its Anthropic Console or Claude Code interface.

1. Start the MCP server locally with `npm start`
2. In Claude Code, use the `/connect` command:
   ```
   /connect mcp --path [path-to-server]
   ```
   For CLI-based servers using stdio, specify the path to the server executable
3. Claude will automatically discover the available Vercel tools
4. You can then ask Claude to perform Vercel operations, for example:
   ```
   Please list my recent Vercel deployments using the vercel-list-all-deployments tool
   ```
5. Alternatively, you can expose the MCP server as an HTTP server with a tool like `mcp-proxy`
   ```bash
   npm install -g @modelcontextprotocol/proxy
   mcp-proxy --stdio --cmd "npm start" --port 3399
   ```
   Then connect in Claude: `/connect mcp --url http://localhost:3399`

### Integrating with Cursor

Cursor has built-in support for MCP tools through its extension system.

1. Start the MCP server with `npm start`
2. In Cursor, access Settings → Tools
3. Under "Model Context Protocol (MCP)", click "+ Add MCP tool"
4. Configure a new connection:
   - For stdio transport: Point to the executable path
   - For HTTP transport: Specify the URL (e.g., http://localhost:3399)
5. Cursor will automatically discover the available Vercel tools
6. Use Cursor's AI features to interact with your Vercel deployments by mentioning the tools in your prompts

### Programmatic Integration

You can also use the Model Context Protocol SDK to integrate with the server programmatically in your own applications:

```javascript
import { Client } from "@modelcontextprotocol/sdk/client";

// Create an MCP client connected to a stdio transport
const client = new Client({
  transport: "stdio",
  cmd: "npm --prefix /path/to/vercel-mcp start",
});

// Or connect to an HTTP transport
const httpClient = new Client({
  transport: "http",
  url: "http://localhost:3399",
});

// Connect to the server
await client.connect();

// List available tools
const { tools } = await client.listTools();
console.log(
  "Available tools:",
  tools.map((t) => t.name)
);

// Call a tool
const result = await client.callTool({
  name: "vercel-list-all-deployments",
  args: { limit: 5 },
});

console.log("Deployments:", result);

// You can also use this in an Express server:
app.post("/api/deployments", async (req, res) => {
  try {
    const result = await client.callTool({
      name: "vercel-list-all-deployments",
      args: req.body,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🛠️ Tool Usage Examples

### List Deployments

```javascript
const response = await mcpClient.callTool({
  name: "vercel-list-all-deployments",
  args: {
    limit: 5,
    target: "production",
  },
});
```

### Get Specific Deployment

```javascript
const deployment = await mcpClient.callTool({
  name: "vercel-get-deployment",
  args: {
    idOrUrl: "dpl_5WJWYSyB7BpgTj3EuwF37WMRBXBtPQ2iTMJHJBJyRfd",
  },
});
```

### List Deployment Files

```javascript
const files = await mcpClient.callTool({
  name: "vercel-list-deployment-files",
  args: {
    id: "dpl_5WJWYSyB7BpgTj3EuwF37WMRBXBtPQ2iTMJHJBJyRfd",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
  },
});
```

### List Projects

```javascript
const projects = await mcpClient.callTool({
  name: "vercel-list-projects",
  args: {
    limit: 10,
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
    search: "my-app", // Optional
  },
});
```

### Find a Project

```javascript
const project = await mcpClient.callTool({
  name: "vercel-find-project",
  args: {
    idOrName: "my-project-name", // Can use either project ID or name
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
  },
});
```

### Get Project Domain

```javascript
const domain = await mcpClient.callTool({
  name: "vercel-get-project-domain",
  args: {
    idOrName: "my-project-id",
    domain: "www.example.com",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
  },
});
```

### Create a Deployment

```javascript
// Create a basic deployment
const basicDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    project: "my-project-id",
    target: "production",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
  },
});

// Redeploy an existing deployment
const redeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    deploymentId: "dpl_123abc456def",
  },
});

// Create a deployment with Git source (from GitHub)
const gitDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    project: "my-project-id",
    gitSource: {
      type: "github",
      ref: "main",
    },
    gitMetadata: {
      commitMessage: "add method to measure Interaction to Next Paint",
      commitAuthorName: "developer",
      remoteUrl: "https://github.com/vercel/next.js",
    },
  },
});

// Create a deployment with custom files
const fileDeployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    name: "my-instant-deployment",
    project: "my-deployment-project",
    files: [
      {
        file: "index.html",
        data: "PGgxPkhlbGxvIFdvcmxkPC9oMT4=", // Base64 encoded <h1>Hello World</h1>
        encoding: "base64",
      },
    ],
    projectSettings: {
      framework: "nextjs",
      buildCommand: "next build",
      installCommand: "npm install",
      nodeVersion: "18.x",
    },
  },
});
```

### Create a New Team

```javascript
const team = await mcpClient.callTool({
  name: "vercel-create-team",
  args: {
    slug: "my-awesome-team",
    name: "My Awesome Team",
  },
});
```

### Create a Custom Environment

```javascript
const customEnv = await mcpClient.callTool({
  name: "vercel-create-custom-environment",
  args: {
    idOrName: "my-project-id",
    name: "staging",
    description: "Staging environment for QA testing",
    branchMatcher: {
      type: "startsWith",
      pattern: "staging/",
    },
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l", // Optional
  },
});
```

## 🐳 Docker Deployment

### Build the Image

```bash
docker build -t vercel-mcp .
```

### Run Container

```bash
docker run -it --rm \
  -e VERCEL_API_TOKEN=your_token_here \
  -p 3399:3399 \
  vercel-mcp
```

### Production Deployment

```bash
docker run -d \
  --name vercel-mcp \
  --restart unless-stopped \
  -e VERCEL_API_TOKEN=your_token_here \
  -p 3399:3399 \
  vercel-mcp
```

### Development with Live Reload

```bash
docker build --target builder -t vercel-mcp-dev .
docker run -it --rm \
  -e VERCEL_API_TOKEN=your_token_here \
  -p 3399:3399 \
  -v $(pwd)/src:/app/src \
  vercel-mcp-dev
```

## 🗂️ Project Structure

```
src/
├── constants/       # Tool definitions
├── tools/
│   ├── deployments/ # Deployment handlers
│   │   ├── handlers.ts
│   │   ├── schema.ts
│   │   └── types.ts
│   └── environments/# Environment management
├── utils/          # API helpers
└── index.ts         # Server entrypoint
```

## 🔧 Configuration

### Environment Variables

| Variable           | Description         | Required |
| ------------------ | ------------------- | -------- |
| `VERCEL_API_TOKEN` | Vercel access token | Yes      |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details
