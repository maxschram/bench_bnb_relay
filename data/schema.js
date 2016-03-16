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
    if (type === 'Bench') {
      return getBench(id);
    } else if (type === 'User') {
      return getUser(id);
    } else if (type === 'Test') {
      return getTest(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Bench) {
      return benchType;
    } else if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Test) {
      return testType;
    } else {
      return null;
    }
  }
);
//
// var getBenches = function () {
//   return Bench.findAll().then(benches => benches);
// };

class User {};
var u = new User();
var getUser = function () { return u; };

class Test {};
var t = new Test();
t.id = 1;
t.text = "asdf";

var t2 = new Test();
t2.id = 2;
t.text = "ajdsflk";
var testsO = {1: t, 2: t2};

var getTest = function (id) {
  return testsO[id];
}

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

var testType = new GraphQLObjectType({
  name: "Test",
  fields: () => ({
    id: globalIdField('Bench'),
    text: {type: GraphQLString}
  }),
  interfaces: [nodeInterface],
});

var {
  connectionType: TestConnection,
} = connectionDefinitions({
  name: 'Test',
  nodeType: testType,
});

var tests = [
  {id: 1, text: "Goodbye"},
  {id: 2, text: "Hello"}
];

var userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    test: {
      type: TestConnection,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(tests, args)
    },
    benches: {
      type: new GraphQLList(benchType),
      args: {
      },
      resolve: resolver(Bench)
    },
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
