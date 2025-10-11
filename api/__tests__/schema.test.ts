/**
 * Schema Tests
 */

import { loadSchema, typeDefs, schemaMetadata } from '../schema/index.js';

describe('HyperGraphQL Schema', () => {
  test('should load schema from file', () => {
    const schema = loadSchema();
    expect(schema).toBeDefined();
    expect(schema.length).toBeGreaterThan(0);
  });
  
  test('should export typeDefs', () => {
    expect(typeDefs).toBeDefined();
    expect(typeof typeDefs).toBe('string');
  });
  
  test('should contain HyperEntity type', () => {
    expect(typeDefs).toContain('type HyperEntity');
    expect(typeDefs).toContain('id: ID!');
    expect(typeDefs).toContain('type: String!');
  });
  
  test('should contain HyperRelation type', () => {
    expect(typeDefs).toContain('type HyperRelation');
    expect(typeDefs).toContain('source: String!');
    expect(typeDefs).toContain('target: String!');
  });
  
  test('should contain Query type', () => {
    expect(typeDefs).toContain('type Query');
    expect(typeDefs).toContain('entity(id: ID!');
    expect(typeDefs).toContain('entities(');
    expect(typeDefs).toContain('hypergraph(organization: String!)');
  });
  
  test('should contain Mutation type', () => {
    expect(typeDefs).toContain('type Mutation');
    expect(typeDefs).toContain('createEntity(');
    expect(typeDefs).toContain('createRelation(');
    expect(typeDefs).toContain('syncGitHub(');
  });
  
  test('should have schema metadata', () => {
    expect(schemaMetadata).toBeDefined();
    expect(schemaMetadata.version).toBe('1.0.0');
    expect(schemaMetadata.entities).toContain('HyperEntity');
    expect(schemaMetadata.queries).toContain('entity');
    expect(schemaMetadata.mutations).toContain('createEntity');
  });
});
