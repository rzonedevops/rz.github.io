# HyperGraphQL Implementation Guide

## Overview

This repository now includes a complete HyperGraphQL API implementation for org-aware repository management. The API enables mapping of HyperGNN entities and relations to GitHub repository structures with flexible scaling capabilities.

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
GITHUB_TOKEN=your_github_personal_access_token
DEFAULT_ORG=rzonedevops
```

### 3. Build

```bash
npm run build
```

### 4. Run Tests

```bash
npm test
```

## Architecture

```
api/
├── types/          # Core TypeScript type definitions
├── schema/         # GraphQL schema (entities, relations, hypergraphs)
├── resolvers/      # Query and mutation resolvers
├── github/         # GitHub integration (projection, scaling)
├── endpoints/      # API endpoint handlers
├── client/         # JavaScript/TypeScript client SDK
└── config.ts       # Configuration management
```

## Core Concepts

### HyperEntity

Represents a node in the hypergraph:

```typescript
{
  id: string;
  type: string;
  attributes: Record<string, any>;
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### HyperRelation

Represents an edge between entities:

```typescript
{
  id: string;
  type: string;
  source: string;      // Entity ID
  target: string;      // Entity ID
  attributes: Record<string, any>;
  organization?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### HyperGraph

Collection of entities and relations with metadata:

```typescript
{
  entities: HyperEntity[];
  relations: HyperRelation[];
  metadata: {
    organization: string;
    repository: string;
    branch: string;
    version: string;
    lastSync: Date;
  }
}
```

## Usage Examples

### Example 1: Using the Client SDK

```typescript
import { createClient } from './api/client/index.js';

// Initialize client
const client = createClient({
  endpoint: '/api/graphql',
  organization: 'my-org'
});

// Create entities
const developer = await client.createEntity('Developer', {
  name: 'Alice',
  skills: ['TypeScript', 'GraphQL'],
  level: 'Senior'
}, 'my-org');

const repository = await client.createEntity('Repository', {
  name: 'awesome-project',
  language: 'TypeScript',
  stars: 100
}, 'my-org');

// Create relationship
const contribution = await client.createRelation(
  'Contributes',
  developer.id,
  repository.id,
  { commits: 150, role: 'Maintainer' },
  'my-org'
);

// Query entities
const developers = await client.getEntities({
  organization: 'my-org',
  entityType: 'Developer'
});

console.log(`Found ${developers.length} developers`);
```

### Example 2: Navigate Hypergraph

```typescript
// Navigate from a developer to find all related repositories
const subgraph = await client.navigate(
  developer.id,
  2,  // depth: explore 2 levels deep
  ['Contributes', 'Maintains']  // relation types to follow
);

console.log('Connected entities:', subgraph.entities);
console.log('Relationships:', subgraph.relations);
```

### Example 3: GitHub Repository Projection

```typescript
import { projection } from './api/github/index.js';

const orgContext = {
  orgId: 'my-org',
  orgName: 'my-org',
  repos: ['repo1', 'repo2'],
  level: 'org'
};

// Project entity to file path
const entityProjection = projection.projectEntityToPath(developer, orgContext);
// Result: { path: 'my-org/repo/entities/Developer/dev-123.json', ... }

// Generate folder structure
const folders = projection.generateOrgStructure(orgContext);
console.log('Generated folders:', folders);
```

### Example 4: Scaling Operations

```typescript
import { scaling } from './api/github/index.js';

// Get hypergraph for organization
const hypergraph = await client.getHyperGraph('my-org');

// Compress to folder level (for storage optimization)
const compressed = await scaling.compressHyperGraph(
  hypergraph,
  { mode: 'compress', level: 'folder' },
  orgContext
);

// Expand to org level (for enterprise view)
const expanded = await scaling.expandHyperGraph(
  hypergraph,
  { mode: 'expand', level: 'org' },
  orgContext
);
```

### Example 5: Using REST Endpoints

```bash
# Sync with GitHub repository
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{
    "organization": "my-org",
    "repository": "my-repo"
  }'

# Get projections
curl http://localhost:3000/api/projections/my-org

# Scale hypergraph
curl -X POST http://localhost:3000/api/scale \
  -H "Content-Type: application/json" \
  -d '{
    "organization": "my-org",
    "scaling": {
      "mode": "compress",
      "level": "folder"
    }
  }'
```

### Example 6: GraphQL Queries

```graphql
# Query entities
query GetDevelopers {
  entities(
    filter: {
      organization: "my-org"
      entityType: "Developer"
    }
    limit: 10
  ) {
    id
    type
    attributes
    organization
  }
}

# Navigate hypergraph
query NavigateFromEntity {
  navigate(
    entityId: "dev-123"
    depth: 2
    relationTypes: ["Contributes", "Maintains"]
  ) {
    entities {
      id
      type
      attributes
    }
    relations {
      id
      type
      source
      target
      attributes
    }
  }
}

# Create entity mutation
mutation CreateRepository {
  createEntity(
    type: "Repository"
    attributes: {
      name: "new-repo"
      language: "TypeScript"
    }
    organization: "my-org"
  ) {
    id
    type
    attributes
  }
}
```

## GitHub Repository Structure

The API maps hypergraph structures to GitHub repository folders:

```
organization-name/
├── repo-name/
│   ├── entities/
│   │   ├── Developer/
│   │   │   ├── dev-1.json
│   │   │   ├── dev-2.json
│   │   │   └── dev-3.json
│   │   ├── Repository/
│   │   │   ├── repo-1.json
│   │   │   └── repo-2.json
│   │   └── Project/
│   │       └── project-1.json
│   └── relations/
│       ├── Contributes/
│       │   ├── rel-1.json
│       │   └── rel-2.json
│       ├── Maintains/
│       │   └── rel-3.json
│       └── DependsOn/
│           └── rel-4.json
```

### Entity File Format

```json
{
  "id": "dev-1",
  "type": "Developer",
  "attributes": {
    "name": "Alice",
    "skills": ["TypeScript", "GraphQL"],
    "level": "Senior"
  },
  "organization": "my-org",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Relation File Format

```json
{
  "id": "rel-1",
  "type": "Contributes",
  "source": "dev-1",
  "target": "repo-1",
  "attributes": {
    "commits": 150,
    "role": "Maintainer"
  },
  "organization": "my-org",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Scaling Levels

The API supports four organizational levels:

1. **Folder Level**: Entities grouped by type within folders
2. **Repo Level**: Entities distributed across repository structure
3. **Org Level**: Entities aggregated across organization repositories
4. **Enterprise Level**: Entities spanning multiple organizations

### Compression

Compressing reduces the granularity for storage optimization:
- Enterprise → Org: Combine multiple orgs
- Org → Repo: Combine multiple repos
- Repo → Folder: Aggregate by type

### Expansion

Expanding increases granularity for detailed views:
- Folder → Repo: Distribute to repository structure
- Repo → Org: Aggregate to organization level
- Org → Enterprise: Combine organizations

## Integration with HyperGNN

The API is designed to work seamlessly with HyperGNN:

1. **Entity Compatibility**: Entities map directly to HyperGNN nodes
2. **Relation Compatibility**: Relations map to HyperGNN hyperedges
3. **Attribute Flexibility**: Custom attributes support any HyperGNN features
4. **Organization Awareness**: Built-in multi-org support

## Testing

The implementation includes comprehensive tests:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test suite
npm test -- api/__tests__/schema.test.ts
```

Test Coverage:
- Schema validation tests
- Resolver unit tests
- Endpoint integration tests
- 20+ test cases covering all core functionality

## Development

### Build

```bash
npm run build
```

Output is in `dist/` directory.

### Lint

```bash
npm run lint
```

### Watch Mode

```bash
# In one terminal - build watch
npm run build -- --watch

# In another terminal - test watch
npm test -- --watch
```

## API Reference

Full API documentation is available in [api/README.md](api/README.md).

## License

MIT
