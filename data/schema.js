/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Bench,
} from './database';

import {resolver} from 'graphql-sequelize';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else {
      return null;
    }
  }
);

class User {};
var u = new User();
var getUser = function () { return u; };

/**
 * Define your own types here
 */

var benchType = new GraphQLObjectType({
  name: 'Bench',
  description: 'A bench',
  fields: () => ({
    id: globalIdField('Bench'),
    description: {type: GraphQLString},
    lat: {type: GraphQLFloat},
    lng: {type: GraphQLFloat},
    seating: {type: GraphQLInt}
  }),
  interfaces: [nodeInterface],
});

var {
  connectionType: BenchesConnection
} = connectionDefinitions({
  name: 'Bench',
  nodeType: benchType,
});

var userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    bench: {
      type: benchType,
      args: {
        id: {
          description: 'the id of the bench',
          type: new GraphQLNonNull(GraphQLInt)
        },
      },
      resolve: resolver(Bench)
    },
    benches: {
      type: BenchesConnection,
      args: {
        id: {type: GraphQLInt},
        minSeating: {type: GraphQLInt},
        maxSeating: {type: GraphQLInt},
        northEastLat: {type: GraphQLFloat},
        northEastLng: {type: GraphQLFloat},
        southWestLat: {type: GraphQLFloat},
        southWestLng: {type: GraphQLFloat},
        ...connectionArgs
      },
      resolve:  (obj, args) => {
        return Bench.findAll({
          where: {
            seating: {
              $between: [args.minSeating, args.maxSeating]
            },
            lat: {
              $between: [args.southWestLat, args.northEastLat]
            },
            lng: {
              $between: [args.southWestLng, args.northEastLng]
            }
          },
        }).then(benches => {
          return connectionFromArray(benches, args)
        });
      },
    }
  }),
  interfaces: [nodeInterface]
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: userType,
      resolve: () => getUser()
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
