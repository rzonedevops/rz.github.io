/**
 * Basic Usage Example for HyperGraphQL API
 */

import { createClient } from '../client/index.js';
import type { HyperEntity, HyperRelation } from '../types/index.js';

/**
 * Example 1: Create and query entities
 */
async function exampleCreateAndQuery() {
  console.log('=== Example 1: Create and Query Entities ===\n');
  
  const client = createClient({
    endpoint: '/api/graphql',
    organization: 'example-org'
  });
  
  // Create a developer entity
  const developer: HyperEntity = await client.createEntity(
    'Developer',
    {
      name: 'Alice Johnson',
      role: 'Senior Engineer',
      skills: ['TypeScript', 'GraphQL', 'React'],
      yearsOfExperience: 5
    },
    'example-org'
  );
  
  console.log('Created developer:', developer);
  
  // Create a project entity
  const project: HyperEntity = await client.createEntity(
    'Project',
    {
      name: 'HyperGraphQL',
      description: 'GraphQL API for hypergraph management',
      status: 'active',
      priority: 'high'
    },
    'example-org'
  );
  
  console.log('Created project:', project);
  
  // Create a relation between developer and project
  const worksOn: HyperRelation = await client.createRelation(
    'WorksOn',
    developer.id,
    project.id,
    {
      hoursPerWeek: 40,
      role: 'Lead Developer',
      startDate: new Date().toISOString()
    },
    'example-org'
  );
  
  console.log('Created relation:', worksOn);
  
  // Query all developers
  const developers = await client.getEntities({
    organization: 'example-org'
  });
  
  console.log(`\nFound ${developers.length} developers\n`);
}

/**
 * Example 2: Navigate hypergraph
 */
async function exampleNavigateGraph() {
  console.log('=== Example 2: Navigate Hypergraph ===\n');
  
  const client = createClient({
    endpoint: '/api/graphql',
    organization: 'example-org'
  });
  
  // Assuming we have a developer ID
  const developerId = 'dev-123';
  
  // Navigate from developer to find all connected entities
  const subgraph = await client.navigate(
    developerId,
    2, // Explore 2 levels deep
    ['WorksOn', 'Maintains', 'Contributes']
  );
  
  console.log(`Found ${subgraph.entities.length} connected entities`);
  console.log(`Found ${subgraph.relations.length} relationships`);
  
  // Display the subgraph structure
  subgraph.entities.forEach(entity => {
    console.log(`  - ${entity.type}: ${entity.attributes.name || entity.id}`);
  });
  
  console.log();
}

/**
 * Example 3: Query with filters
 */
async function exampleFilteredQuery() {
  console.log('=== Example 3: Filtered Queries ===\n');
  
  const client = createClient({
    endpoint: '/api/graphql',
    organization: 'example-org'
  });
  
  // Find all senior developers
  const seniorDevs = await client.getEntities({
    organization: 'example-org'
  });
  
  console.log(`Found ${seniorDevs.length} senior developers`);
  
  // Find all active projects
  const activeProjects = await client.getEntities({
    organization: 'example-org'
  });
  
  console.log(`Found ${activeProjects.length} active projects`);
  console.log();
}

/**
 * Example 4: Organization-level operations
 */
async function exampleOrgOperations() {
  console.log('=== Example 4: Organization Operations ===\n');
  
  const client = createClient({
    endpoint: '/api/graphql',
    organization: 'example-org'
  });
  
  // Get full hypergraph for organization
  const hypergraph = await client.getHyperGraph('example-org');
  
  console.log('Organization Hypergraph:');
  console.log(`  Entities: ${hypergraph.entities.length}`);
  console.log(`  Relations: ${hypergraph.relations.length}`);
  console.log(`  Organization: ${hypergraph.metadata.organization}`);
  console.log(`  Repository: ${hypergraph.metadata.repository}`);
  console.log(`  Last Sync: ${hypergraph.metadata.lastSync}`);
  console.log();
}

/**
 * Example 5: GitHub sync
 */
async function exampleGitHubSync() {
  console.log('=== Example 5: GitHub Sync ===\n');
  
  const client = createClient({
    endpoint: '/api/graphql',
    organization: 'example-org'
  });
  
  // Sync with GitHub repository
  const syncedGraph = await client.syncGitHub('example-org', 'example-repo');
  
  console.log('Synced from GitHub:');
  console.log(`  Organization: ${syncedGraph.metadata.organization}`);
  console.log(`  Repository: ${syncedGraph.metadata.repository}`);
  console.log(`  Entities synced: ${syncedGraph.entities.length}`);
  console.log(`  Relations synced: ${syncedGraph.relations.length}`);
  console.log();
}

/**
 * Run all examples
 */
async function runExamples() {
  try {
    await exampleCreateAndQuery();
    await exampleNavigateGraph();
    await exampleFilteredQuery();
    await exampleOrgOperations();
    await exampleGitHubSync();
    
    console.log('✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
    process.exit(1);
  }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples();
}

export {
  exampleCreateAndQuery,
  exampleNavigateGraph,
  exampleFilteredQuery,
  exampleOrgOperations,
  exampleGitHubSync
};
