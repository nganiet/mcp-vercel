import { vercelFetch } from "../../utils/api.js";
import { VERCEL_API } from "../../utils/config.js";
import {
  CreateProjectArgumentsSchema,
  CreateEnvironmentVariablesSchema,
  ListProjectsArgumentsSchema,
} from "./schema.js";
import type {
  ProjectResponse,
  EnvironmentVariablesResponse,
  ListProjectsResponse,
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
 * List projects
 * @param params - The parameters for listing projects
 * @returns The response from the API
 */
export async function handleListProjects(params: any = {}) {
  try {
    const { limit, from, teamId } = ListProjectsArgumentsSchema.parse(params);

    const url = new URL("v10/projects", VERCEL_API);
    const queryParams = new URLSearchParams();

    if (limit) queryParams.append("limit", limit.toString());
    if (from) queryParams.append("from", from.toString());
    if (teamId) queryParams.append("teamId", teamId);

    const fullUrl = `${url}?${queryParams.toString()}`;
    const data = await vercelFetch<ListProjectsResponse>(fullUrl);

    return {
      content: [
        {
          type: "text",
          text: `Found ${data?.projects.length} projects`,
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
