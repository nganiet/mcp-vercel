export interface Project {
  id: string;
  name: string;
  accountId: string;
  framework: string | null;
  latestDeployments: {
    alias: string[];
  }[];
  targets: {
    production: {
      alias: string[];
    };
  };
  createdAt: number;
  updatedAt: number;
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  target: string[];
  type: string;
  gitBranch?: string;
  createdAt: number;
  updatedAt: number;
}

export interface EnvironmentVariablesResponse {
  created: EnvironmentVariable[];
  skipped: {
    key: string;
    code: string;
    message: string;
  }[];
}

export interface ListProjectsResponse {
  projects: Project[];
  pagination: {
    count: number;
    next: number | null;
    prev: number | null;
  };
}

export interface ProjectResponse {
  id: string;
  name: string;
  accountId: string;
  createdAt: number;
  updatedAt: number;
  framework: string | null;
}

export interface FindProjectResponse {
  id: string;
  name: string;
  accountId: string;
  createdAt: number;
  updatedAt: number;
  env: EnvironmentVariable[];
  buildCommand: string | null;
  devCommand: string | null;
  installCommand: string | null;
  outputDirectory: string | null;
  publicSource: boolean | null;
  rootDirectory: string | null;
  serverlessFunctionRegion: string | null;
  nodeVersion: string;
  framework: string | null;
  directoryListing: boolean;
  passwordProtection: null | {
    deploymentType: string;
  };
}

export interface ProjectDomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect: string | null;
  redirectStatusCode: number | null;
  gitBranch: string | null;
  customEnvironmentId: string | null;
  updatedAt: number;
  createdAt: number;
  verified: boolean;
  verification: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}
