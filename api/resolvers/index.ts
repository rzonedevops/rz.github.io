/**
 * Central resolver export
 */

import entityResolvers from './entityResolvers.js';
import relationResolvers from './relationResolvers.js';
import hypergraphResolvers from './hypergraphResolvers.js';

/**
 * Merge all resolvers
 */
export const resolvers = {
  Query: {
    ...entityResolvers.Query,
    ...relationResolvers.Query,
    ...hypergraphResolvers.Query
  },
  Mutation: {
    ...entityResolvers.Mutation,
    ...relationResolvers.Mutation
  },
  HyperEntity: entityResolvers.HyperEntity,
  HyperRelation: relationResolvers.HyperRelation,
  Organization: hypergraphResolvers.Organization
};

export default resolvers;
