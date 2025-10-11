/**
 * GraphQL Schema Builder for HyperGraphQL
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load GraphQL schema from file
 */
export function loadSchema(): string {
  const schemaPath = join(__dirname, 'hypergraph.graphql');
  return readFileSync(schemaPath, 'utf-8');
}

/**
 * GraphQL type definitions as string export
 */
export const typeDefs = `
${loadSchema()}
`;

/**
 * Schema metadata
 */
export const schemaMetadata = {
  version: '1.0.0',
  description: 'HyperGraphQL schema for GitHub repository management',
  entities: [
    'HyperEntity',
    'HyperRelation',
    'HyperGraph',
    'Organization',
    'GitHubProjection'
  ],
  queries: [
    'entity',
    'entities',
    'relation',
    'relations',
    'hypergraph',
    'organization',
    'projections',
    'navigate'
  ],
  mutations: [
    'createEntity',
    'updateEntity',
    'deleteEntity',
    'createRelation',
    'updateRelation',
    'deleteRelation',
    'syncGitHub',
    'scaleHyperGraph'
  ]
};

export default typeDefs;
