import React, { Component } from 'react';
import { Button, Input } from 'react-materialize';
import { graphql, compose, Mutation, Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import {AuthContext} from './authprovider';

const fullPost = gql`
  query fullPost($id: ID!) {
    post(id: $id){
      id
      title
      body
      comments {
        username
        comment
      }
    }
  }
`;

const addComment = gql`
  mutation($id: ID!, $username: String!, $comment: String!) {
    addComment(id: $id, username: $username, comment: $comment){
      comments {
        username
        comment
      }
    }
  }
`;


const Poster = (props) => (
  <Query query={fullPost} variables={{id: props.currentId}}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        console.log(data);
        const {title, body, comments} = data.post;
          return (
            <div className="topmodal">
              <div className="modaldiv">
                <div className="modalcontent">
                  <div className="content">
                  <h2>{title}</h2>
                  <div className="divider"></div>
                  <p>{body}</p>
                  <div className="divider"></div>
                  <h5>Comments <small>{comments.length}</small></h5>
                  {comments.map(({username, comment}) => (
                      <span className="comment">{comment} <strong>Created by {username}</strong></span>
                  ))}
                  </div>
                  </div>
                </div>
              </div>
          );

      }}
    </Query>
);

class ViewPost extends Component {
state ={
  body: ''
}
render() {
  console.log(this.props)
  return (
    <AuthContext.Consumer>
      {(user) => (
        <Poster currentId={this.props.match.params.id}/>
      )}
  </AuthContext.Consumer>
  );
}
renderComments() {
  const { comments } = this.props.data.post;
  if (comments.length === 0) {
    return (
      <span>No Comments...</span>
    );
  }
  return comments.map(({ username, comment }) => {
    return (
      <span>{comment} <strong>Create by {username}</strong></span>
    );
    })
}
handleSubmit(e, user) {
  e.preventDefault();
  const { post } = this.props.data;
  this.props.addComment({
    variables: {
    id: post.id,
    username: user.username,
    comment: this.state.body
  },
  // refetchQueries: [{ query: fullPost}]
  })
}
handleChange(e) {
  this.setState({[e.target.name]: e.target.value});
}
}

export default ViewPost;
