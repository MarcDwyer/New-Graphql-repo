import React, { Component } from 'react';
import { Button, Input } from 'react-materialize';
import { Mutation, Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import {AuthContext} from './authprovider';
import uuid from 'uuid';

const FullPost = gql`
   query($id: ID!) {
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
      id
      comments {
        username
        comment
      }
    }
  }
`;


class ViewPost extends Component {
state ={
  body: ''
}
render() {

  return (
    <AuthContext.Consumer>
      {(user) => (
        <Query query={FullPost} variables={{id: this.props.match.params.id}}>
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              const {title, body, comments, id} = data.post;

                return (
                  <div className="topmodal">
                    <div className="modaldiv">
                      <div className="modalcontent">
                        <div className="content">
                        <h2>{title}</h2>
                        <div className="divider"></div>
                        <p>{body}</p>
                        <div className="divider"></div>
                        <Mutation
                          mutation={addComment}
                          >
                          {(addComment, { data }) => (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const newUser = user ? user.username : 'Anonymous';
                                addComment({variables: {
                                  id,
                                  username: newUser,
                                  comment: this.state.body
                                }})
                                this.setState({body: ''})
                              }}>
                            <Input
                            type="textarea"
                            name="body"
                            value={this.state.body}
                            onChange={(e) => {
                              this.setState({[e.target.name]: e.target.value});
                            }}
                              />
                            <Button type="submit">Submit</Button>
                            </form>
                          )}
                      </Mutation>
                        <div className="divider"></div>
                        <h5>Comments <small>{comments.length}</small></h5>
                        {comments.map(({username, comment}) => (
                            <span key={uuid()} className="comment">{comment} <strong>Created by {username}</strong></span>
                        ))}
                        </div>
                        </div>
                      </div>
                    </div>
                );

            }}
          </Query>
      )}
  </AuthContext.Consumer>
  );
}
}

export default ViewPost;
