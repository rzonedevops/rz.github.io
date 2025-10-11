/**
 * GraphQL Schema Builder for HyperGraphQL
 */

/**
 * Load GraphQL schema from file
 */
export function loadSchema(): string {
  // Return inline schema for portability
  return `
"""
HyperGraphQL Schema for GitHub Repository Management
"""

type HyperEntity {
  id: ID!
  type: String!
  attributes: JSON!
  organization: String
  createdAt: String!
  updatedAt: String!
  relations: [HyperRelation!]!
}

type HyperRelation {
  id: ID!
  type: String!
  source: String!
  target: String!
  attributes: JSON!
  organization: String
  createdAt: String!
  updatedAt: String!
  sourceEntity: HyperEntity
  targetEntity: HyperEntity
}

type HyperGraph {
  entities: [HyperEntity!]!
  relations: [HyperRelation!]!
  metadata: HyperGraphMetadata!
}

type HyperGraphMetadata {
  organization: String!
  repository: String!
  branch: String!
  version: String!
  lastSync: String!
}

type Organization {
  id: ID!
  name: String!
  repos: [String!]!
  level: OrgLevel!
  hypergraph: HyperGraph
}

enum OrgLevel {
  REPO
  ORG
  ENTERPRISE
}

type GitHubProjection {
  path: String!
  type: ProjectionType!
  content: JSON!
  organization: String!
}

enum ProjectionType {
  ENTITY
  RELATION
}

input ScalingInput {
  mode: ScalingMode!
  level: ScalingLevel!
  targetPath: String
}

enum ScalingMode {
  COMPRESS
  EXPAND
}

enum ScalingLevel {
  FOLDER
  REPO
  ORG
  ENTERPRISE
}

input QueryFilter {
  organization: String
  repository: String
  entityType: String
  relationType: String
  attributes: JSON
}

type Query {
  """Get entity by ID"""
  entity(id: ID!, organization: String): HyperEntity
  
  """Get entities with filters"""
  entities(
    filter: QueryFilter
    limit: Int = 100
    offset: Int = 0
  ): [HyperEntity!]!
  
  """Get relation by ID"""
  relation(id: ID!, organization: String): HyperRelation
  
  """Get relations with filters"""
  relations(
    filter: QueryFilter
    limit: Int = 100
    offset: Int = 0
  ): [HyperRelation!]!
  
  """Get full hypergraph for organization"""
  hypergraph(organization: String!): HyperGraph
  
  """Get organization details"""
  organization(id: ID!): Organization
  
  """Get GitHub projections for an organization"""
  projections(organization: String!): [GitHubProjection!]!
  
  """Navigate hypergraph from entity"""
  navigate(
    entityId: ID!
    depth: Int = 1
    relationTypes: [String!]
  ): HyperGraph
}

type Mutation {
  """Create new entity"""
  createEntity(
    type: String!
    attributes: JSON!
    organization: String
  ): HyperEntity!
  
  """Update entity"""
  updateEntity(
    id: ID!
    attributes: JSON!
  ): HyperEntity!
  
  """Delete entity"""
  deleteEntity(id: ID!): Boolean!
  
  """Create new relation"""
  createRelation(
    type: String!
    source: String!
    target: String!
    attributes: JSON!
    organization: String
  ): HyperRelation!
  
  """Update relation"""
  updateRelation(
    id: ID!
    attributes: JSON!
  ): HyperRelation!
  
  """Delete relation"""
  deleteRelation(id: ID!): Boolean!
  
  """Sync with GitHub repository"""
  syncGitHub(
    organization: String!
    repository: String!
  ): HyperGraph!
  
  """Scale hypergraph structure"""
  scaleHyperGraph(
    organization: String!
    scaling: ScalingInput!
  ): Boolean!
}

scalar JSON
  `;
}

/**
 * GraphQL type definitions as string export
 */
export const typeDefs = loadSchema();

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
