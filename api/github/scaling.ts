/**
 * Scaling utilities for HyperGraph structures
 * Compress and expand hypergraphs across different organizational levels
 */

import type {
  HyperGraph,
  ScalingConfig,
  OrganizationContext,
  HyperEntity,
  HyperRelation
} from '../types/index.js';

/**
 * Compress hypergraph for storage or lower organizational level
 */
export async function compressHyperGraph(
  hypergraph: HyperGraph,
  config: ScalingConfig,
  orgContext: OrganizationContext
): Promise<HyperGraph> {
  const compressed: HyperGraph = {
    entities: [],
    relations: [],
    metadata: {
      ...hypergraph.metadata,
      version: `${hypergraph.metadata.version}-compressed`
    }
  };
  
  switch (config.level) {
    case 'folder':
      // Compress to folder level - aggregate by type
      compressed.entities = aggregateEntitiesByType(hypergraph.entities);
      compressed.relations = aggregateRelationsByType(hypergraph.relations);
      break;
      
    case 'repo':
      // Compress to repo level - maintain repo structure
      compressed.entities = hypergraph.entities.filter(
        e => e.organization === orgContext.orgName
      );
      compressed.relations = hypergraph.relations.filter(
        r => r.organization === orgContext.orgName
      );
      break;
      
    case 'org':
      // Compress to org level - aggregate repos
      compressed.entities = hypergraph.entities;
      compressed.relations = hypergraph.relations;
      break;
      
    case 'enterprise':
      // No compression at enterprise level
      compressed.entities = hypergraph.entities;
      compressed.relations = hypergraph.relations;
      break;
  }
  
  return compressed;
}

/**
 * Expand hypergraph for higher organizational level
 */
export async function expandHyperGraph(
  hypergraph: HyperGraph,
  config: ScalingConfig,
  orgContext: OrganizationContext
): Promise<HyperGraph> {
  const expanded: HyperGraph = {
    entities: [],
    relations: [],
    metadata: {
      ...hypergraph.metadata,
      version: `${hypergraph.metadata.version}-expanded`
    }
  };
  
  switch (config.level) {
    case 'repo':
      // Expand from folder to repo level
      expanded.entities = hypergraph.entities;
      expanded.relations = hypergraph.relations;
      break;
      
    case 'org':
      // Expand from repo to org level
      expanded.entities = hypergraph.entities;
      expanded.relations = hypergraph.relations;
      break;
      
    case 'enterprise':
      // Expand from org to enterprise level
      expanded.entities = hypergraph.entities;
      expanded.relations = hypergraph.relations;
      break;
      
    default:
      expanded.entities = hypergraph.entities;
      expanded.relations = hypergraph.relations;
  }
  
  return expanded;
}

/**
 * Aggregate entities by type
 */
function aggregateEntitiesByType(entities: HyperEntity[]): HyperEntity[] {
  const aggregated = new Map<string, HyperEntity>();
  
  for (const entity of entities) {
    const key = entity.type;
    
    if (aggregated.has(key)) {
      // Merge attributes
      const existing = aggregated.get(key)!;
      existing.attributes = {
        ...existing.attributes,
        count: (existing.attributes.count || 1) + 1
      };
    } else {
      aggregated.set(key, {
        ...entity,
        id: `aggregated_${key}`,
        attributes: {
          ...entity.attributes,
          count: 1
        }
      });
    }
  }
  
  return Array.from(aggregated.values());
}

/**
 * Aggregate relations by type
 */
function aggregateRelationsByType(relations: HyperRelation[]): HyperRelation[] {
  const aggregated = new Map<string, HyperRelation>();
  
  for (const relation of relations) {
    const key = relation.type;
    
    if (aggregated.has(key)) {
      // Merge attributes
      const existing = aggregated.get(key)!;
      existing.attributes = {
        ...existing.attributes,
        count: (existing.attributes.count || 1) + 1
      };
    } else {
      aggregated.set(key, {
        ...relation,
        id: `aggregated_${key}`,
        attributes: {
          ...relation.attributes,
          count: 1
        }
      });
    }
  }
  
  return Array.from(aggregated.values());
}

/**
 * Scale hypergraph based on configuration
 */
export async function scaleHyperGraph(
  hypergraph: HyperGraph,
  config: ScalingConfig,
  orgContext: OrganizationContext
): Promise<HyperGraph> {
  if (config.mode === 'compress') {
    return compressHyperGraph(hypergraph, config, orgContext);
  } else {
    return expandHyperGraph(hypergraph, config, orgContext);
  }
}

export default {
  compressHyperGraph,
  expandHyperGraph,
  scaleHyperGraph
};
