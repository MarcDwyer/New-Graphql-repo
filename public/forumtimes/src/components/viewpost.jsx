import React, { Component } from 'react';
import { Button, Input } from 'react-materialize';
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
                      <h4>Loading Post...</h4>
                    </div>
                  </div>
                </div>
              );
              if (error) return `Error! ${error.message}`;
              const {title, body, comments, id, username} = data.post;

                return (
                  <div className="topmodal">
                    <div className="modaldiv">
                      <div className="modalcontent">
                        <div className="content">
                        <h2>{title}</h2>
                        <div className="divider"></div>
                        <p>{body}</p>
                        {this.deletePost(user, username, id)}
                        <div className="divider"></div>
                        <Mutation
                          mutation={addComment}
                          update={(cache, { data: { addComment } }) => {
                            const { posts } = cache.readQuery({ query: getPosts });
                            cache.writeQuery({
                              query: getPosts,
                              data: { posts: posts.concat([addComment])}
                            });
                          }
                          }
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
                            className="thecomment"
                            placeholder="What are your thoughts?"
                            value={this.state.body}
                            onChange={(e) => {
                              this.setState({[e.target.name]: e.target.value});
                            }}
                              />
                            <Button type="submit" className="mb">Comment</Button>
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
deletePost(user, username, id) {
  if (user.username === username) {
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
            <strong>Delete Post</strong>
          </span>
        )}
      </Mutation>
    );
  }
}
}

export default ViewPost;
