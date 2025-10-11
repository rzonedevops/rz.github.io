/**
 * API Endpoint Tests
 */

import { handleGraphQLRequest } from '../endpoints/graphql.js';
import { handleSync, handleProjections, handleOrganization } from '../endpoints/rest.js';

describe('GraphQL Endpoint', () => {
  test('should handle GraphQL request', async () => {
    const query = `
      query {
        __schema {
          types {
            name
          }
        }
      }
    `;
    
    const response = await handleGraphQLRequest(
      JSON.stringify({ query }),
      {}
    );
    
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    
    const body = JSON.parse(response.body);
    expect(body.data).toBeDefined();
  });
  
  test('should handle invalid GraphQL request', async () => {
    const response = await handleGraphQLRequest(
      'invalid json',
      {}
    );
    
    expect(response.status).toBe(400);
  });
});

describe('REST Endpoints', () => {
  test('should handle sync request', async () => {
    const response = await handleSync(
      JSON.stringify({
        organization: 'test-org',
        repository: 'test-repo'
      })
    );
    
    expect(response.status).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.metadata).toBeDefined();
  });
  
  test('should reject sync without parameters', async () => {
    const response = await handleSync(
      JSON.stringify({})
    );
    
    expect(response.status).toBe(400);
  });
  
  test('should handle projections request', async () => {
    const response = await handleProjections('test-org');
    
    expect(response.status).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
  });
  
  test('should handle organization request', async () => {
    const response = await handleOrganization('test-org');
    
    expect(response.status).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.orgId).toBe('test-org');
  });
});
