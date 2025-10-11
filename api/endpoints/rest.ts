/**
 * REST Endpoints for GitHub Sync and Management
 */

import type { HyperGraph, OrganizationContext } from '../types/index.js';
import * as github from '../github/index.js';

/**
 * Sync endpoint - POST /api/sync
 */
export async function handleSync(
  body: string
): Promise<{ status: number; body: string }> {
  try {
    const { organization, repository } = JSON.parse(body);
    
    if (!organization || !repository) {
      return {
        status: 400,
        body: JSON.stringify({
          error: 'organization and repository are required'
        })
      };
    }
    
    const hypergraph = await github.syncWithGitHub(organization, repository);
    
    return {
      status: 200,
      body: JSON.stringify(hypergraph)
    };
  } catch (error) {
    return {
      status: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Sync failed'
      })
    };
  }
}

/**
 * Projections endpoint - GET /api/projections/:org
 */
export async function handleProjections(
  organization: string
): Promise<{ status: number; body: string }> {
  try {
    const projections = await github.getProjections(organization);
    
    return {
      status: 200,
      body: JSON.stringify(projections)
    };
  } catch (error) {
    return {
      status: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to get projections'
      })
    };
  }
}

/**
 * Organization endpoint - GET /api/organizations/:id
 */
export async function handleOrganization(
  orgId: string
): Promise<{ status: number; body: string }> {
  try {
    // This would fetch organization details
    const orgContext: OrganizationContext = {
      orgId,
      orgName: orgId,
      repos: [],
      level: 'org'
    };
    
    return {
      status: 200,
      body: JSON.stringify(orgContext)
    };
  } catch (error) {
    return {
      status: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to get organization'
      })
    };
  }
}

/**
 * Scale endpoint - POST /api/scale
 */
export async function handleScale(
  body: string
): Promise<{ status: number; body: string }> {
  try {
    const { organization, scaling } = JSON.parse(body);
    
    if (!organization || !scaling) {
      return {
        status: 400,
        body: JSON.stringify({
          error: 'organization and scaling config are required'
        })
      };
    }
    
    // This would perform the scaling operation
    return {
      status: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      status: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Scaling failed'
      })
    };
  }
}

export default {
  handleSync,
  handleProjections,
  handleOrganization,
  handleScale
};
