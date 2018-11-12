const { buildSchema } = require('graphql');
const Post = require('../models/posts');
const User = require('../models/user-model');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');



const schema = buildSchema(`
  type Query {
    post(id: ID!): id
  }
`);

const root = {
  post: (args) => {
    console.log(args);
    return args.id;
  }
}

module.exports = {
  schema: schema,
  rootValue: root
};
