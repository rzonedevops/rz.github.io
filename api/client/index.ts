/**
 * HyperGraphQL Client
 * Client-side methods for querying the HyperGraphQL API
 */

import type {
  HyperEntity,
  HyperRelation,
  HyperGraph,
  QueryContext,
  OrganizationContext
} from '../types/index.js';

export interface ClientConfig {
  endpoint?: string;
  organization?: string;
  headers?: Record<string, string>;
}

export class HyperGraphQLClient {
  private config: ClientConfig;
  
  constructor(config: ClientConfig = {}) {
    this.config = {
      endpoint: config.endpoint || '/api/graphql',
      organization: config.organization,
      headers: config.headers || {}
    };
  }
  
  /**
   * Execute GraphQL query
   */
  private async query<T = any>(
    query: string,
    variables: Record<string, any> = {}
  ): Promise<T> {
    const response = await fetch(this.config.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-organization': this.config.organization || '',
        ...this.config.headers
      },
      body: JSON.stringify({ query, variables })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    return result.data;
  }
  
  /**
   * Get entity by ID
   */
  async getEntity(id: string, organization?: string): Promise<HyperEntity | null> {
    const query = `
      query GetEntity($id: ID!, $organization: String) {
        entity(id: $id, organization: $organization) {
          id
          type
          attributes
          organization
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await this.query<{ entity: HyperEntity }>(query, {
      id,
      organization: organization || this.config.organization
    });
    
    return result.entity;
  }
  
  /**
   * Get entities with filters
   */
  async getEntities(
    filter?: QueryContext,
    limit = 100,
    offset = 0
  ): Promise<HyperEntity[]> {
    const query = `
      query GetEntities($filter: QueryFilter, $limit: Int, $offset: Int) {
        entities(filter: $filter, limit: $limit, offset: $offset) {
          id
          type
          attributes
          organization
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await this.query<{ entities: HyperEntity[] }>(query, {
      filter,
      limit,
      offset
    });
    
    return result.entities;
  }
  
  /**
   * Get relation by ID
   */
  async getRelation(id: string, organization?: string): Promise<HyperRelation | null> {
    const query = `
      query GetRelation($id: ID!, $organization: String) {
        relation(id: $id, organization: $organization) {
          id
          type
          source
          target
          attributes
          organization
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await this.query<{ relation: HyperRelation }>(query, {
      id,
      organization: organization || this.config.organization
    });
    
    return result.relation;
  }
  
  /**
   * Get relations with filters
   */
  async getRelations(
    filter?: QueryContext,
    limit = 100,
    offset = 0
  ): Promise<HyperRelation[]> {
    const query = `
      query GetRelations($filter: QueryFilter, $limit: Int, $offset: Int) {
        relations(filter: $filter, limit: $limit, offset: $offset) {
          id
          type
          source
          target
          attributes
          organization
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await this.query<{ relations: HyperRelation[] }>(query, {
      filter,
      limit,
      offset
    });
    
    return result.relations;
  }
  
  /**
   * Get hypergraph for organization
   */
  async getHyperGraph(organization: string): Promise<HyperGraph> {
    const query = `
      query GetHyperGraph($organization: String!) {
        hypergraph(organization: $organization) {
          entities {
            id
            type
            attributes
            organization
          }
          relations {
            id
            type
            source
            target
            attributes
            organization
          }
          metadata {
            organization
            repository
            branch
            version
            lastSync
          }
        }
      }
    `;
    
    const result = await this.query<{ hypergraph: HyperGraph }>(query, {
      organization: organization || this.config.organization
    });
    
    return result.hypergraph;
  }
  
  /**
   * Navigate hypergraph from entity
   */
  async navigate(
    entityId: string,
    depth = 1,
    relationTypes?: string[]
  ): Promise<HyperGraph> {
    const query = `
      query Navigate($entityId: ID!, $depth: Int, $relationTypes: [String!]) {
        navigate(entityId: $entityId, depth: $depth, relationTypes: $relationTypes) {
          entities {
            id
            type
            attributes
            organization
          }
          relations {
            id
            type
            source
            target
            attributes
            organization
          }
          metadata {
            organization
            repository
            branch
            version
            lastSync
          }
        }
      }
    `;
    
    const result = await this.query<{ navigate: HyperGraph }>(query, {
      entityId,
      depth,
      relationTypes
    });
    
    return result.navigate;
  }
  
  /**
   * Create new entity
   */
  async createEntity(
    type: string,
    attributes: Record<string, any>,
    organization?: string
  ): Promise<HyperEntity> {
    const query = `
      mutation CreateEntity($type: String!, $attributes: JSON!, $organization: String) {
        createEntity(type: $type, attributes: $attributes, organization: $organization) {
          id
          type
          attributes
          organization
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await this.query<{ createEntity: HyperEntity }>(query, {
      type,
      attributes,
      organization: organization || this.config.organization
    });
    
    return result.createEntity;
  }
  
  /**
   * Create new relation
   */
  async createRelation(
    type: string,
    source: string,
    target: string,
    attributes: Record<string, any>,
    organization?: string
  ): Promise<HyperRelation> {
    const query = `
      mutation CreateRelation(
        $type: String!,
        $source: String!,
        $target: String!,
        $attributes: JSON!,
        $organization: String
      ) {
        createRelation(
          type: $type,
          source: $source,
          target: $target,
          attributes: $attributes,
          organization: $organization
        ) {
          id
          type
          source
          target
          attributes
          organization
          createdAt
          updatedAt
        }
      }
    `;
    
    const result = await this.query<{ createRelation: HyperRelation }>(query, {
      type,
      source,
      target,
      attributes,
      organization: organization || this.config.organization
    });
    
    return result.createRelation;
  }
  
  /**
   * Sync with GitHub
   */
  async syncGitHub(organization: string, repository: string): Promise<HyperGraph> {
    const query = `
      mutation SyncGitHub($organization: String!, $repository: String!) {
        syncGitHub(organization: $organization, repository: $repository) {
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
          metadata {
            organization
            repository
            branch
            version
            lastSync
          }
        }
      }
    `;
    
    const result = await this.query<{ syncGitHub: HyperGraph }>(query, {
      organization,
      repository
    });
    
    return result.syncGitHub;
  }
}

/**
 * Create a new client instance
 */
export function createClient(config?: ClientConfig): HyperGraphQLClient {
  return new HyperGraphQLClient(config);
}

export default {
  HyperGraphQLClient,
  createClient
};
