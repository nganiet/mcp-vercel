import { z } from "zod";

export const EnvironmentVariableSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  target: z.array(z.enum(["production", "preview", "development"])),
  type: z.enum(["system", "encrypted", "plain", "sensitive"]),
  gitBranch: z.string().optional(),
});

export const CreateEnvironmentVariablesSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  teamId: z.string().optional(),
  environmentVariables: z.array(EnvironmentVariableSchema).min(1),
});

export const CreateProjectArgumentsSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  framework: z.string().optional(),
  buildCommand: z.string().optional(),
  devCommand: z.string().optional(),
  installCommand: z.string().optional(),
  outputDirectory: z.string().optional(),
  publicSource: z.boolean().optional(),
  rootDirectory: z.string().optional(),
  serverlessFunctionRegion: z.string().optional(),
  skipGitConnectDuringLink: z.boolean().optional(),
  teamId: z.string().min(1, "Team ID is required"),
});

export const ListProjectsArgumentsSchema = z.object({
  limit: z.number().int().positive().optional().describe("Number of projects to return"),
  from: z.number().int().optional().describe("Projects created/updated after this timestamp"),
  teamId: z.string().optional().describe("Team ID for request scoping"),
  search: z.string().optional().describe("Search projects by name"),
  repoUrl: z.string().optional().describe("Filter by repository URL"),
  gitForkProtection: z.enum(["0", "1"]).optional().describe("Specify PR authorization from forks (0/1)"),
});

export const FindProjectArgumentsSchema = z.object({
  idOrName: z.string().min(1, "Project ID or name is required"),
  teamId: z.string().optional().describe("Team ID for request scoping"),
});

export const DeleteProjectArgumentsSchema = z.object({
  idOrName: z.string().min(1, "Project ID or name is required"),
  teamId: z.string().optional().describe("Team ID for request scoping"),
  slug: z.string().optional().describe("Team slug for request scoping"),
});

export const GetProjectDomainArgumentsSchema = z.object({
  idOrName: z.string().min(1, "Project ID or name is required"),
  domain: z.string().min(1, "Domain name is required"),
  teamId: z.string().optional().describe("Team ID for request scoping"),
  slug: z.string().optional().describe("Team slug for request scoping"),
});

export const RemoveEnvironmentVariableArgumentsSchema = z.object({
  idOrName: z.string().min(1, "Project ID or name is required"),
  id: z.string().min(1, "Environment variable ID is required"),
  customEnvironmentId: z.string().optional().describe("Custom environment ID"),
  teamId: z.string().optional().describe("Team ID for request scoping"),
  slug: z.string().optional().describe("Team slug for request scoping"),
});
