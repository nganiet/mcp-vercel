import { vercelFetch } from "../../utils/api.js";
import { VERCEL_API } from "../../utils/config.js";
import {
  CreateProjectArgumentsSchema,
  CreateEnvironmentVariablesSchema,
  ListProjectsArgumentsSchema,
  FindProjectArgumentsSchema,
  GetProjectDomainArgumentsSchema,
  DeleteProjectArgumentsSchema,
  RemoveEnvironmentVariableArgumentsSchema,
} from "./schema.js";
import type {
  ProjectResponse,
  EnvironmentVariablesResponse,
  ListProjectsResponse,
  FindProjectResponse,
  ProjectDomainResponse,
} from "./types.js";

/**
 * Create environment variables for a project
 * @param params - The parameters for creating environment variables
 * @returns The response from the API
 */
export async function handleCreateEnvironmentVariables(params: any = {}) {
  try {
    const { projectId, teamId, environmentVariables } =
      CreateEnvironmentVariablesSchema.parse(params);

    const url = `v10/projects/${encodeURIComponent(projectId)}/env${
      teamId ? `?teamId=${teamId}` : ""
    }`;

    const data = await vercelFetch<EnvironmentVariablesResponse>(url, {
      method: "POST",
      body: JSON.stringify(environmentVariables),
    });

    return {
      content: [
        {
          type: "text",
          text: `Successfully created ${data?.created.length} environment variables`,
        },
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error
              ? error.message
              : "Failed to create environment variables"
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Remove an environment variable from a project
 * @param params - The parameters for removing an environment variable
 * @returns The response from the API
 */
export async function handleRemoveEnvironmentVariable(params: any = {}) {
  try {
    const { idOrName, id, customEnvironmentId, teamId, slug } = 
      RemoveEnvironmentVariableArgumentsSchema.parse(params);

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (customEnvironmentId) queryParams.append("customEnvironmentId", customEnvironmentId);
    if (teamId) queryParams.append("teamId", teamId);
    if (slug) queryParams.append("slug", slug);

    const url = `v9/projects/${encodeURIComponent(idOrName)}/env/${encodeURIComponent(id)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const data = await vercelFetch<any>(url, {
      method: "DELETE",
    });

    return {
      content: [
        {
          type: "text",
          text: `Environment variable ${id} removed successfully from project ${idOrName}`,
        },
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error 
              ? error.message 
              : "Failed to remove environment variable"
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Delete a project by ID or name
 * @param params - The parameters for deleting a project
 * @returns The response from the API
 */
export async function handleDeleteProject(params: any = {}) {
  try {
    const { idOrName, teamId, slug } = 
      DeleteProjectArgumentsSchema.parse(params);

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (teamId) queryParams.append("teamId", teamId);
    if (slug) queryParams.append("slug", slug);

    const url = `v9/projects/${encodeURIComponent(idOrName)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    await vercelFetch(url, {
      method: "DELETE",
    });

    return {
      content: [
        {
          type: "text",
          text: `Project ${idOrName} deleted successfully`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : "Failed to delete project"
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * List projects
 * @param params - The parameters for listing projects
 * @returns The response from the API
 */
export async function handleListProjects(params: any = {}) {
  try {
    const { limit, from, teamId, search, repoUrl, gitForkProtection } = 
      ListProjectsArgumentsSchema.parse(params);

    // Build the query URL with parameters
    let endpoint = "v9/projects";
    const queryParams = new URLSearchParams();

    if (limit) queryParams.append("limit", limit.toString());
    if (from) queryParams.append("from", from.toString());
    if (teamId) queryParams.append("teamId", teamId);
    if (search) queryParams.append("search", search);
    if (repoUrl) queryParams.append("repoUrl", repoUrl);
    if (gitForkProtection) queryParams.append("gitForkProtection", gitForkProtection);

    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }

    const data = await vercelFetch<ListProjectsResponse>(endpoint);

    if (!data || !data.projects) {
      return {
        content: [
          {
            type: "text",
            text: "No projects found or invalid response from API",
            isError: true
          }
        ]
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Found ${data.projects.length} projects`,
        },
        {
          type: "text",
          text: JSON.stringify(data.projects, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : "Failed to list projects"
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Create a project
 * @param params - The parameters for creating a project
 * @returns The response from the API
 */
export async function handleCreateProject(params: any = {}) {
  try {
    const {
      name,
      framework,
      buildCommand,
      devCommand,
      installCommand,
      outputDirectory,
      publicSource,
      rootDirectory,
      serverlessFunctionRegion,
      skipGitConnectDuringLink,
      teamId,
    } = CreateProjectArgumentsSchema.parse(params);

    const url = `v11/projects${teamId ? `?teamId=${teamId}` : ""}`;

    const projectData = {
      name,
      framework,
      buildCommand,
      devCommand,
      installCommand,
      outputDirectory,
      publicSource,
      rootDirectory,
      serverlessFunctionRegion,
      skipGitConnectDuringLink,
    };

    const data = await vercelFetch<ProjectResponse>(url, {
      method: "POST",
      body: JSON.stringify(projectData),
    });

    return {
      content: [
        {
          type: "text",
          text: `Project ${data?.name} (${data?.id}) created successfully`,
        },
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : "Failed to create project"
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Find a project by ID or name
 * @param params - The parameters for finding a project
 * @returns The response from the API
 */
export async function handleFindProject(params: any = {}) {
  try {
    const { idOrName, teamId } = FindProjectArgumentsSchema.parse(params);

    const url = `v9/projects/${encodeURIComponent(idOrName)}${
      teamId ? `?teamId=${teamId}` : ""
    }`;

    const data = await vercelFetch<FindProjectResponse>(url);

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Project not found",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Found project: ${data.name} (${data.id})`,
        },
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : "Failed to find project"
          }`,
          isError: true,
        },
      ],
    };
  }
}

/**
 * Get a project domain
 * @param params - The parameters for getting a project domain
 * @returns The response from the API
 */
export async function handleGetProjectDomain(params: any = {}) {
  try {
    const { idOrName, domain, teamId, slug } = 
      GetProjectDomainArgumentsSchema.parse(params);

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (teamId) queryParams.append("teamId", teamId);
    if (slug) queryParams.append("slug", slug);

    const url = `v9/projects/${encodeURIComponent(idOrName)}/domains/${encodeURIComponent(domain)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const data = await vercelFetch<ProjectDomainResponse>(url);

    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Domain not found",
            isError: true,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Found domain: ${data.name} (verified: ${data.verified})`,
        },
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : "Failed to get project domain"
          }`,
          isError: true,
        },
      ],
    };
  }
}
