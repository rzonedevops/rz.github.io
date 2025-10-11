/**
 * GitHub Repository Projection
 * Maps entities and relations to GitHub repository folder structure
 */

import type {
  HyperEntity,
  HyperRelation,
  GitHubProjection,
  OrganizationContext
} from '../types/index.js';

/**
 * Project entity to GitHub file path
 */
export function projectEntityToPath(
  entity: HyperEntity,
  orgContext: OrganizationContext
): GitHubProjection {
  const basePath = `${orgContext.orgName}/${entity.organization || 'default'}`;
  const entityPath = `${basePath}/entities/${entity.type}/${entity.id}.json`;
  
  return {
    path: entityPath,
    type: 'entity',
    content: entity,
    organization: orgContext.orgName
  };
}

/**
 * Project relation to GitHub file path
 */
export function projectRelationToPath(
  relation: HyperRelation,
  orgContext: OrganizationContext
): GitHubProjection {
  const basePath = `${orgContext.orgName}/${relation.organization || 'default'}`;
  const relationPath = `${basePath}/relations/${relation.type}/${relation.id}.json`;
  
  return {
    path: relationPath,
    type: 'relation',
    content: relation,
    organization: orgContext.orgName
  };
}

/**
 * Generate folder structure for organization
 */
export function generateOrgStructure(
  orgContext: OrganizationContext
): string[] {
  const folders: string[] = [];
  
  // Base folders
  folders.push(`${orgContext.orgName}/entities`);
  folders.push(`${orgContext.orgName}/relations`);
  
  // Repo-specific folders
  for (const repo of orgContext.repos) {
    folders.push(`${orgContext.orgName}/${repo}/entities`);
    folders.push(`${orgContext.orgName}/${repo}/relations`);
  }
  
  return folders;
}

/**
 * Parse entity from GitHub file path
 */
export function parseEntityFromPath(
  path: string,
  content: string
): HyperEntity | null {
  try {
    const pathParts = path.split('/');
    if (!pathParts.includes('entities')) {
      return null;
    }
    
    const entity = JSON.parse(content) as HyperEntity;
    return {
      ...entity,
      createdAt: new Date(entity.createdAt),
      updatedAt: new Date(entity.updatedAt)
    };
  } catch (error) {
    console.error(`Failed to parse entity from path ${path}:`, error);
    return null;
  }
}

/**
 * Parse relation from GitHub file path
 */
export function parseRelationFromPath(
  path: string,
  content: string
): HyperRelation | null {
  try {
    const pathParts = path.split('/');
    if (!pathParts.includes('relations')) {
      return null;
    }
    
    const relation = JSON.parse(content) as HyperRelation;
    return {
      ...relation,
      createdAt: new Date(relation.createdAt),
      updatedAt: new Date(relation.updatedAt)
    };
  } catch (error) {
    console.error(`Failed to parse relation from path ${path}:`, error);
    return null;
  }
}

/**
 * Get file content for projection
 */
export function getProjectionContent(projection: GitHubProjection): string {
  return JSON.stringify(projection.content, null, 2);
}

export default {
  projectEntityToPath,
  projectRelationToPath,
  generateOrgStructure,
  parseEntityFromPath,
  parseRelationFromPath,
  getProjectionContent
};
