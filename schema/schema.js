const { graphql, buildSchema } = require('graphql');
const Post = require('../models/posts');
const User = require('../models/user-model');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;


const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {type: GraphQLID},
    username: {type: GraphQLString},
    title: {type: GraphQLString},
    body: {type: GraphQLString},
    comments: {type: new GraphQLList(CommentType)},
    date: {type: GraphQLString}
})
})



const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    username: {type: GraphQLString},
    comment: {type: GraphQLString}
  })
})
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    username: {type: GraphQLString},
    googleId: {type: GraphQLID}
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    post: {
      type: PostType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {

        const bottle = Post.findById(args.id);
        console.log(bottle);
        return bottle;
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve() {
        return Post.find({});
      }
    },
    getUser: {
      type: UserType,
      resolve(parent, args, req) {
        if (!req.user) return null;
        return req.user;
      }
    },
    getCommentLength: {
      type: CommentLength,
      args: {id: {type:GraphQLID}},
      resolve(parent, args) {
      return  Post.aggregate([{$match: {_id: ObjectId(args.id)}}, {$project: {comments: {$size: '$comments'}}}], (err, res) => {
        console.log(res[0].comments);
        const newObj = {
          length: res[0].comments
        }
        console.log(newObj)
        return newObj;
    })
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPost: {
      type: PostType,
      args: {
        username: {type: GraphQLString},
        title: {type: new GraphQLNonNull(GraphQLString)},
        body: {type: new GraphQLNonNull(GraphQLString)},
        date: {type: GraphQLString}
      },
      resolve(parent, args) {

        let post = new Post({username: args.username, title: args.title, body: args.body, date: args.date, comments: []});
        return post.save();
      }
    },
    addComment: {
      type: PostType,
      args: {
        id: {type: GraphQLID},
        username: {type: GraphQLString},
        comment: {type: GraphQLString}
      },
      resolve(parent, args) {
       return Post.findByIdAndUpdate(args.id, {$push: {comments: {username: args.username, comment: args.comment}}}, {new: true});
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
