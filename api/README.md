# HyperGraphQL API

A GraphQL-based API for managing hypergraph structures mapped to GitHub repositories with organization-aware capabilities.

## Overview

The HyperGraphQL API enables:
- **Org-aware repository management**: Manage entities and relations across organizational hierarchies
- **GitHub integration**: Map hypergraph structures to GitHub repository folder structures
- **Flexible scaling**: Compress and expand hypergraphs across different organizational levels (folder → repo → org → enterprise)
- **HyperGNN compatibility**: Native support for HyperGNN entity and relation structures

## Architecture

```
api/
├── types/          # TypeScript type definitions
├── schema/         # GraphQL schema definitions
├── resolvers/      # Query and mutation resolvers
├── github/         # GitHub integration (projection, scaling)
├── endpoints/      # API endpoint handlers (GraphQL, REST)
├── client/         # Client SDK
└── config.ts       # Configuration
```

## Quick Start

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file:

```env
GITHUB_TOKEN=your_github_token
DEFAULT_ORG=your_organization
```

### Usage

#### Client SDK

```typescript
import { createClient } from './api/client/index.js';

// Create client
const client = createClient({
  endpoint: '/api/graphql',
  organization: 'my-org'
});

// Query entities
const entities = await client.getEntities({
  organization: 'my-org',
  entityType: 'User'
});

// Create entity
const entity = await client.createEntity(
  'User',
  { name: 'John', role: 'developer' },
  'my-org'
);

// Navigate hypergraph
const graph = await client.navigate('entity-id', 2);
```

## GraphQL Schema

### Core Types

#### HyperEntity
```graphql
type HyperEntity {
  id: ID!
  type: String!
  attributes: JSON!
  organization: String
  createdAt: String!
  updatedAt: String!
  relations: [HyperRelation!]!
}
```

#### HyperRelation
```graphql
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
```

#### HyperGraph
```graphql
type HyperGraph {
  entities: [HyperEntity!]!
  relations: [HyperRelation!]!
  metadata: HyperGraphMetadata!
}
```

### Queries

```graphql
# Get entity by ID
entity(id: ID!, organization: String): HyperEntity

# Get entities with filters
entities(filter: QueryFilter, limit: Int, offset: Int): [HyperEntity!]!

# Get full hypergraph for organization
hypergraph(organization: String!): HyperGraph

# Navigate hypergraph from entity
navigate(entityId: ID!, depth: Int, relationTypes: [String!]): HyperGraph
```

### Mutations

```graphql
# Create entity
createEntity(type: String!, attributes: JSON!, organization: String): HyperEntity!

# Create relation
createRelation(
  type: String!,
  source: String!,
  target: String!,
  attributes: JSON!,
  organization: String
): HyperRelation!

# Sync with GitHub
syncGitHub(organization: String!, repository: String!): HyperGraph!

# Scale hypergraph
scaleHyperGraph(organization: String!, scaling: ScalingInput!): Boolean!
```

## GitHub Integration

### Repository Structure

Entities and relations are mapped to GitHub repository folders:

```
organization/
├── repo-name/
│   ├── entities/
│   │   ├── User/
│   │   │   ├── entity-1.json
│   │   │   └── entity-2.json
│   │   └── Project/
│   │       └── entity-3.json
│   └── relations/
│       ├── MemberOf/
│       │   └── relation-1.json
│       └── WorksOn/
│           └── relation-2.json
```

### Projection

Map entities/relations to file paths:

```typescript
import { projection } from './api/github/index.js';

const entityProjection = projection.projectEntityToPath(entity, orgContext);
// Returns: { path: 'org/repo/entities/User/entity-1.json', ... }
```

### Scaling

Compress or expand hypergraphs across organizational levels:

```typescript
import { scaling } from './api/github/index.js';

// Compress to folder level
const compressed = await scaling.compressHyperGraph(
  hypergraph,
  { mode: 'compress', level: 'folder' },
  orgContext
);

// Expand to org level
const expanded = await scaling.expandHyperGraph(
  hypergraph,
  { mode: 'expand', level: 'org' },
  orgContext
);
```

## REST Endpoints

### POST /api/sync
Sync hypergraph with GitHub repository

```bash
curl -X POST /api/sync \
  -H "Content-Type: application/json" \
  -d '{"organization": "my-org", "repository": "my-repo"}'
```

### GET /api/projections/:org
Get GitHub projections for organization

```bash
curl /api/projections/my-org
```

### GET /api/organizations/:id
Get organization details

```bash
curl /api/organizations/my-org
```

### POST /api/scale
Scale hypergraph structure

```bash
curl -X POST /api/scale \
  -H "Content-Type: application/json" \
  -d '{
    "organization": "my-org",
    "scaling": {
      "mode": "compress",
      "level": "folder"
    }
  }'
```

## Testing

Run tests:

```bash
npm test
```

Run with coverage:

```bash
npm test -- --coverage
```

## Development

Build TypeScript:

```bash
npm run build
```

Lint code:

```bash
npm run lint
```

## Examples

### Example 1: Create and Query Entities

```typescript
// Create entities
const user = await client.createEntity('User', {
  name: 'Alice',
  role: 'developer'
}, 'my-org');

const project = await client.createEntity('Project', {
  name: 'HyperGraphQL',
  status: 'active'
}, 'my-org');

// Create relation
const relation = await client.createRelation(
  'WorksOn',
  user.id,
  project.id,
  { hours: 40 },
  'my-org'
);

// Query
const developers = await client.getEntities({
  organization: 'my-org',
  entityType: 'User',
  attributes: { role: 'developer' }
});
```

### Example 2: Navigate Hypergraph

```typescript
// Navigate from user to find all connected projects
const subgraph = await client.navigate(
  user.id,
  2, // depth
  ['WorksOn', 'Manages'] // relation types
);

console.log(`Found ${subgraph.entities.length} entities`);
console.log(`Found ${subgraph.relations.length} relations`);
```

### Example 3: GitHub Sync

```typescript
// Sync with GitHub repo
const hypergraph = await client.syncGitHub('my-org', 'my-repo');

// Get projections
const projections = await fetch('/api/projections/my-org').then(r => r.json());
```

## License

MIT
