# Team Tools

This document provides detailed information about the team-related tools available in the Vercel MCP integration.

## Available Tools

### `vercel-list-all-teams`

List all teams accessible to the authenticated user.

**Inputs:**
- `limit` (number): Maximum results to return
- `since` (number): Timestamp for teams created after
- `until` (number): Timestamp for teams created before
- `teamId` (string): Team ID for request scoping

**Returns:** Paginated list of team objects with metadata

**Example:**
```javascript
const teams = await mcpClient.callTool({
  name: "vercel-list-all-teams",
  args: {
    limit: 20,
    since: 1640995200000 // Timestamp for Jan 1, 2022
  }
});
```

### `vercel-create-team`

Create a new Vercel team.

**Inputs:**
- `slug` (string, required): A unique identifier for the team
- `name` (string): A display name for the team

**Returns:** Created team details including ID, slug, and billing information

**Example:**
```javascript
const team = await mcpClient.callTool({
  name: "vercel-create-team",
  args: {
    slug: "my-awesome-team",
    name: "My Awesome Team"
  }
});
```

## Team Management

Teams in Vercel allow you to:
- Collaborate with other developers on projects
- Share environment variables and secrets
- Manage deployments and domains across multiple projects
- Control access and permissions for team members
- Organize billing and usage across projects

When working with teams, most API operations support a `teamId` parameter to scope the request to a specific team context.