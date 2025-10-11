/**
 * Core type definitions for HyperGraphQL API
 */

export interface HyperEntity {
  id: string;
  type: string;
  attributes: Record<string, any>;
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HyperRelation {
  id: string;
  type: string;
  source: string;
  target: string;
  attributes: Record<string, any>;
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HyperGraph {
  entities: HyperEntity[];
  relations: HyperRelation[];
  metadata: HyperGraphMetadata;
}

export interface HyperGraphMetadata {
  organization: string;
  repository: string;
  branch: string;
  version: string;
  lastSync: Date;
}

export interface OrganizationContext {
  orgId: string;
  orgName: string;
  repos: string[];
  level: 'repo' | 'org' | 'enterprise';
}

export interface GitHubProjection {
  path: string;
  type: 'entity' | 'relation';
  content: HyperEntity | HyperRelation;
  organization: string;
}

export interface ScalingConfig {
  mode: 'compress' | 'expand';
  level: 'folder' | 'repo' | 'org' | 'enterprise';
  targetPath?: string;
}

export interface QueryContext {
  organization?: string;
  repository?: string;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export type ResolverFunction<T = any, A = any, C = QueryContext> = (
  parent: any,
  args: A,
  context: C
) => T | Promise<T>;

export interface HyperGraphQLConfig {
  githubToken?: string;
  defaultOrg?: string;
  cacheTTL?: number;
  maxQueryDepth?: number;
}
