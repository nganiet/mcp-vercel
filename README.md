# Vercel MCP Integration

A Model Context Protocol (MCP) integration for Vercel's REST API, providing programmatic access to Vercel deployment management.

## 📋 Overview <sub><sup>Last updated: July 2024</sup></sub>

This MCP server implements Vercel's core API endpoints as tools, enabling:
- Deployment monitoring & management
- Environment variable retrieval
- Project deployment status tracking
- CI/CD pipeline integration

## ✨ Features

### Current Tools
- `vercel-list-all-deployments` - List deployments with filtering
- `vercel-get-deployment` - Retrieve specific deployment details
- `vercel-get-environments` - Access project environment variables
- `vercel-create-deployment` - Create new deployments
- `vercel-create-project` - Create new Vercel projects
- `vercel-list-all-teams` - List all accessible teams

## 🛣️ Roadmap

- [x] Deployment creation workflow
- [x] Project management tools
- [x] Team management integration
- [ ] Real-time deployment monitoring
- [ ] Advanced error handling
- [ ] Deployment metrics dashboard
- [ ] Team member management operations

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

### `vercel-create-deployment`
Create a new Vercel deployment
- **Inputs**:
  - `name` (string): Deployment/project name (required)
  - `project` (string): Project ID/name (required)
  - `target` (string): Environment (production/preview)
  - `regions` (string[]): Deployment regions
  - `teamId` (string): Team ID for scoping
  - `forceNew` (boolean): Force new deployment
- **Returns**: Created deployment details with status URLs

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

### `vercel-list-all-teams`
List all teams accessible to authenticated user
- **Inputs**:
  - `limit` (number): Maximum results to return
  - `since` (number): Timestamp for teams created after
  - `until` (number): Timestamp for teams created before
  - `teamId` (string): Team ID for request scoping
- **Returns**: Paginated list of team objects with metadata

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Vercel API Token
- MCP Client

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

## 🛠️ Usage Examples

### List Deployments
```javascript
const response = await mcpClient.callTool({
  name: 'vercel-list-all-deployments',
  args: {
    limit: 5,
    target: 'production'
  }
});
```

### Get Specific Deployment
```javascript
const deployment = await mcpClient.callTool({
  name: 'vercel-get-deployment',
  args: {
    idOrUrl: 'dpl_5WJWYSyB7BpgTj3EuwF37WMRBXBtPQ2iTMJHJBJyRfd'
  }
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
| Variable | Description | Required |
|----------|-------------|----------|
| `VERCEL_API_TOKEN` | Vercel access token | Yes |

## 🛣️ Roadmap

- [ ] Add deployment creation support
- [ ] Implement deployment metrics
- [ ] Add project management tools
- [ ] Support team-based operations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details
