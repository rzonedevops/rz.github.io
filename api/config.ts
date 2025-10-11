/**
 * API Configuration
 */

import type { HyperGraphQLConfig } from './types/index.js';

/**
 * Default configuration
 */
export const defaultConfig: HyperGraphQLConfig = {
  githubToken: process.env.GITHUB_TOKEN,
  defaultOrg: process.env.DEFAULT_ORG || 'rzonedevops',
  cacheTTL: 3600, // 1 hour
  maxQueryDepth: 5
};

/**
 * Get configuration with environment overrides
 */
export function getConfig(overrides?: Partial<HyperGraphQLConfig>): HyperGraphQLConfig {
  return {
    ...defaultConfig,
    ...overrides
  };
}

/**
 * API endpoints configuration
 */
export const endpoints = {
  graphql: '/api/graphql',
  sync: '/api/sync',
  projections: '/api/projections',
  organizations: '/api/organizations',
  scale: '/api/scale'
};

export default {
  defaultConfig,
  getConfig,
  endpoints
};
