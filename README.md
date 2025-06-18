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

#### Deployment Management

- [`vercel-list-all-deployments`](docs/deployments.md#vercel-list-all-deployments) - List deployments with filtering
- [`vercel-get-deployment`](docs/deployments.md#vercel-get-deployment) - Retrieve specific deployment details
- [`vercel-list-deployment-files`](docs/deployments.md#vercel-list-deployment-files) - List files in a deployment
- [`vercel-create-deployment`](docs/deployments.md#vercel-create-deployment) - Create new deployments

#### Project Management

- [`vercel-create-project`](docs/projects.md#vercel-create-project) - Create new Vercel projects
- [`vercel-list-projects`](docs/projects.md#vercel-list-projects) - List all projects with pagination
- [`vercel-find-project`](docs/projects.md#vercel-find-project) - Find a specific project by ID or name
- [`vercel-create-environment-variables`](docs/projects.md#vercel-create-environment-variables) - Create multiple environment variables
- [`vercel-get-project-domain`](docs/projects.md#vercel-get-project-domain) - Get information about a specific domain within a project

#### Environment Management

- [`vercel-get-environments`](docs/environments.md#vercel-get-environments) - Access project environment variables
- [`vercel-create-custom-environment`](docs/environments.md#vercel-create-custom-environment) - Create custom environments for projects

#### Team Management

- [`vercel-list-all-teams`](docs/teams.md#vercel-list-all-teams) - List all accessible teams
- [`vercel-create-team`](docs/teams.md#vercel-create-team) - Create a new team with custom slug and name

## 🛣️ Roadmap

- [x] Deployment creation workflow
- [x] Project management tools
- [x] Team management integration (List & Create teams)
- [x] Advanced error handling

## 📚 Tool Documentation

For detailed information about each tool, please refer to the following documentation:

- **[Deployment Tools](docs/deployments.md)** - Tools for managing deployments
- **[Project Tools](docs/projects.md)** - Tools for project and environment variable management
- **[Environment Tools](docs/environments.md)** - Tools for environment configuration
- **[Team Tools](docs/teams.md)** - Tools for team management

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

Here are some quick examples to get you started. For comprehensive documentation and more examples, please refer to the [tool documentation](#-tool-documentation).

### List Recent Deployments

```javascript
const response = await mcpClient.callTool({
  name: "vercel-list-all-deployments",
  args: {
    limit: 5,
    target: "production",
  },
});
```

### Create a New Project

```javascript
const project = await mcpClient.callTool({
  name: "vercel-create-project",
  args: {
    name: "my-awesome-project",
    framework: "nextjs",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l",
  },
});
```

### Deploy from Git

```javascript
const deployment = await mcpClient.callTool({
  name: "vercel-create-deployment",
  args: {
    project: "my-project-id",
    gitSource: {
      type: "github",
      ref: "main",
    },
  },
});
```

For more detailed examples including file deployments, environment management, and team operations, see the documentation:

- [Deployment Examples](docs/deployments.md)
- [Project Examples](docs/projects.md)
- [Environment Examples](docs/environments.md)
- [Team Examples](docs/teams.md)

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
