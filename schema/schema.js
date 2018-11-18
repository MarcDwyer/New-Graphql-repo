const graphql = require('graphql');
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
    date: {type: GraphQLString},
    googleId: {type: GraphQLID},
    commentLength: {
      type: GraphQLString,
       async resolve(parent, args) {
      const data = await Post.aggregate([{$match: {_id: ObjectId(parent.id)}}, {$project: {comments: {$size: '$comments'}}}]);
      return data[0].comments;
      }
    }
    })
});

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
        return bottle;
      }
    },
    posts: {
      type: new GraphQLList(PostType),
    async resolve() {
        const data = await Post.find({}).sort({date: -1});
        return data;

      }
    },
    getUser: {
      type: UserType,
      resolve(parent, args, req) {
        if (!req.user) return null;
        return req.user;
      }
    },
    userPost: {
      type: new GraphQLList(PostType),
      args: {id: {type: GraphQLID}},
      async resolve(parent, args) {
        const data = await Post.find({googleId: args.id}).sort({date: -1});
        return data;
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
        googleId: {type: GraphQLID},
        date: {type: GraphQLString}
      },
      async resolve(parent, args) {
        let post = new Post({username: args.username, googleId: args.googleId, title: args.title, body: args.body, date: args.date, comments: []});
        const data = await post.save();
        data.commentLength = 0;
        return data;
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
    removePost: {
      type: PostType,
      args: {
        id: {type: GraphQLID}
      },
      async resolve(parent, args) {
      const data = await Post.remove({_id: ObjectId(args.id)});
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
