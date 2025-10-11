/**
 * Entity Query Resolvers
 */

import type {
  HyperEntity,
  QueryContext,
  ResolverFunction
} from '../types/index.js';

/**
 * In-memory entity storage (would be replaced with actual data source)
 */
const entityStore = new Map<string, HyperEntity>();

/**
 * Get entity by ID
 */
export const getEntity: ResolverFunction<HyperEntity | null> = async (
  _parent,
  args: { id: string; organization?: string },
  context: QueryContext
) => {
  const entity = entityStore.get(args.id);
  
  if (!entity) {
    return null;
  }
  
  // Filter by organization if specified
  const org = args.organization || context.organization;
  if (org && entity.organization !== org) {
    return null;
  }
  
  return entity;
};

/**
 * Get entities with filters
 */
export const getEntities: ResolverFunction<HyperEntity[]> = async (
  _parent,
  args: {
    filter?: {
      organization?: string;
      repository?: string;
      entityType?: string;
      attributes?: Record<string, any>;
    };
    limit?: number;
    offset?: number;
  },
  context: QueryContext
) => {
  const { filter = {}, limit = 100, offset = 0 } = args;
  
  let entities = Array.from(entityStore.values());
  
  // Apply organization filter
  const org = filter.organization || context.organization;
  if (org) {
    entities = entities.filter(e => e.organization === org);
  }
  
  // Apply entity type filter
  if (filter.entityType) {
    entities = entities.filter(e => e.type === filter.entityType);
  }
  
  // Apply attribute filters
  if (filter.attributes) {
    entities = entities.filter(entity => {
      return Object.entries(filter.attributes!).every(
        ([key, value]) => entity.attributes[key] === value
      );
    });
  }
  
  // Apply pagination
  return entities.slice(offset, offset + limit);
};

/**
 * Create new entity
 */
export const createEntity: ResolverFunction<HyperEntity> = async (
  _parent,
  args: {
    type: string;
    attributes: Record<string, any>;
    organization?: string;
  },
  context: QueryContext
) => {
  const entity: HyperEntity = {
    id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: args.type,
    attributes: args.attributes,
    organization: args.organization || context.organization,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  entityStore.set(entity.id, entity);
  return entity;
};

/**
 * Update entity
 */
export const updateEntity: ResolverFunction<HyperEntity> = async (
  _parent,
  args: {
    id: string;
    attributes: Record<string, any>;
  }
) => {
  const entity = entityStore.get(args.id);
  
  if (!entity) {
    throw new Error(`Entity with id ${args.id} not found`);
  }
  
  entity.attributes = { ...entity.attributes, ...args.attributes };
  entity.updatedAt = new Date();
  
  entityStore.set(entity.id, entity);
  return entity;
};

/**
 * Delete entity
 */
export const deleteEntity: ResolverFunction<boolean> = async (
  _parent,
  args: { id: string }
) => {
  return entityStore.delete(args.id);
};

/**
 * Get relations for an entity
 */
export const getEntityRelations: ResolverFunction<any[]> = async (
  parent: HyperEntity
) => {
  // This would query the relation store
  // Placeholder implementation
  return [];
};

export default {
  Query: {
    entity: getEntity,
    entities: getEntities
  },
  Mutation: {
    createEntity,
    updateEntity,
    deleteEntity
  },
  HyperEntity: {
    relations: getEntityRelations
  }
};
