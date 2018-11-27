import React, { Component } from 'react';
import { Button } from 'react-materialize';
import { Mutation, Query } from 'react-apollo';
import {AuthContext} from './authprovider';
import { getPosts, FullPost, addComment, RemovePost } from '../queries/queries';
import uuid from 'uuid';


class ViewPost extends Component {
state ={
  body: ''
}
componentDidMount() {
document.body.addEventListener('keydown', this.handleExit)
document.body.addEventListener('click', this.handleExit);
}
componentWillUnmount() {
  document.body.removeEventListener('keydown', this.handleExit);
  document.body.removeEventListener('click', this.handleExit);
}
render() {

  return (
    <AuthContext.Consumer>
      {(user) => (
        <Query query={FullPost} variables={{id: this.props.match.params.id}}>
            {({ loading, error, data }) => {
              if (loading) return (
                <div className="topmodal">
                  <div className="modaldiv">
                    <div className="modalcontent">
                      <h4 style={{textAlign: 'center'}}>Loading Post...</h4>
                    </div>
                  </div>
                </div>
              );
              if (error) return `Error! ${error.message}`;
              const {title, body, comments, id, googleId, username } = data.post;
              const signedId = user ? user.googleId : null;

                return (
                  <div className="topmodal">
                    <div className="modaldiv">

                        <div className="content1">
                        <h4>{title}</h4>
                        <span className="smallertext">Posted by {username}</span>
                        <div className="divider"></div>
                        <div className="bodytext">
                        <p className="thebody">{body}</p>
                        </div>
                      {this.deletePost(signedId, googleId, id)}
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
                              <div className="thecomment">
                            <textarea
                            type="textarea"
                            name="body"
                            id="textarea1"
                            className="inputdiv materialize-textarea"
                            placeholder="What are your thoughts?"
                            value={this.state.body}
                            onChange={(e) => {
                              this.setState({[e.target.name]: e.target.value});
                            }}
                              />
                              <label htmlFor="textarea1"></label>
                              </div>
                            <Button type="submit" className="mb">Comment</Button>
                            </form>
                          )}
                      </Mutation>
                        <div className="divider"></div>
                        <h5>Comments <small>{comments.length}</small></h5>
                        <div className="commentsdiv">
                        {comments.map(({username, comment}) => (
                          <div key={uuid()} className="commentdiv">
                            <span className="smallertext"><strong>Created by {username}</strong></span>
                            <p className="comment">{comment}</p>
                            </div>
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
handleExit = (e) => {
  if (e.type === 'keydown') {
  if (e.keyCode === 27) {
    this.props.history.goBack();
  }
} else {
  if (e.target.classList.value.includes('topmodal')) {
    this.props.history.goBack();
  }
}
}
deletePost(signedId, postId, id) {
  if (!signedId) return;
  if (signedId === postId) {
    return (
      <Mutation mutation={RemovePost} refetchQueries={[{query: getPosts}]}>
        {(removePost, { loading, error }) => (
          <span
            className="delete"
            onClick={async () => {
            await removePost({variables: {id}});
            this.props.history.goBack();
            }
          }
            >
            <strong className="deletecomment">Delete Post</strong>
          </span>
        )}
      </Mutation>
    );
  }
}
}

export default ViewPost;
