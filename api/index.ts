/**
 * HyperGraphQL API Entry Point
 */

export * from './types/index.js';
export * from './schema/index.js';
export * from './resolvers/index.js';
export * from './github/index.js';
export * from './endpoints/index.js';
export * from './client/index.js';
export * from './config.js';

import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';
import * as github from './github/index.js';
import * as endpoints from './endpoints/index.js';
import { createClient } from './client/index.js';
import { getConfig } from './config.js';

/**
 * Main API export
 */
export default {
  typeDefs,
  resolvers,
  github,
  endpoints,
  createClient,
  getConfig
};
