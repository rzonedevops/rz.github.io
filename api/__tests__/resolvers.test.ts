/**
 * Resolver Tests
 */

import { getEntity, createEntity, getEntities } from '../resolvers/entityResolvers.js';
import { getRelation, createRelation, getRelations } from '../resolvers/relationResolvers.js';
import { getHyperGraph, navigateHyperGraph } from '../resolvers/hypergraphResolvers.js';

describe('Entity Resolvers', () => {
  test('should create entity', async () => {
    const entity = await createEntity(
      {},
      {
        type: 'TestEntity',
        attributes: { name: 'Test', value: 123 },
        organization: 'test-org'
      },
      {}
    );
    
    expect(entity).toBeDefined();
    expect(entity.id).toBeDefined();
    expect(entity.type).toBe('TestEntity');
    expect(entity.attributes.name).toBe('Test');
    expect(entity.organization).toBe('test-org');
  });
  
  test('should get entity by ID', async () => {
    const created = await createEntity(
      {},
      {
        type: 'TestEntity',
        attributes: { name: 'Test2' }
      },
      {}
    );
    
    const retrieved = await getEntity(
      {},
      { id: created.id },
      {}
    );
    
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created.id);
  });
  
  test('should get entities with filter', async () => {
    await createEntity(
      {},
      {
        type: 'FilterTest',
        attributes: { category: 'A' },
        organization: 'org1'
      },
      {}
    );
    
    const entities = await getEntities(
      {},
      { filter: { organization: 'org1' } },
      {}
    );
    
    expect(Array.isArray(entities)).toBe(true);
  });
});

describe('Relation Resolvers', () => {
  test('should create relation', async () => {
    const relation = await createRelation(
      {},
      {
        type: 'TestRelation',
        source: 'entity1',
        target: 'entity2',
        attributes: { strength: 0.8 }
      },
      {}
    );
    
    expect(relation).toBeDefined();
    expect(relation.id).toBeDefined();
    expect(relation.type).toBe('TestRelation');
    expect(relation.source).toBe('entity1');
    expect(relation.target).toBe('entity2');
  });
  
  test('should get relation by ID', async () => {
    const created = await createRelation(
      {},
      {
        type: 'TestRelation',
        source: 'e1',
        target: 'e2',
        attributes: {}
      },
      {}
    );
    
    const retrieved = await getRelation(
      {},
      { id: created.id },
      {}
    );
    
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created.id);
  });
});

describe('HyperGraph Resolvers', () => {
  test('should get hypergraph for organization', async () => {
    const hypergraph = await getHyperGraph(
      {},
      { organization: 'test-org' },
      {}
    );
    
    expect(hypergraph).toBeDefined();
    expect(hypergraph.entities).toBeDefined();
    expect(hypergraph.relations).toBeDefined();
    expect(hypergraph.metadata).toBeDefined();
    expect(hypergraph.metadata.organization).toBe('test-org');
  });
  
  test('should navigate hypergraph', async () => {
    const result = await navigateHyperGraph(
      {},
      { entityId: 'entity1', depth: 2 },
      {}
    );
    
    expect(result).toBeDefined();
    expect(result.entities).toBeDefined();
    expect(result.relations).toBeDefined();
  });
});
