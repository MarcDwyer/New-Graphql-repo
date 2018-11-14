import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { addPost, getPosts } from '../queries/queries';
import { Button } from 'react-materialize';

import {AuthContext} from './authprovider';

class CreatePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
    }
  }
  render() {
    return (
    <div className="topmodal">
      <div className="modaldiv postcreator">
        <div className="container makewhite mt-3">
          <AuthContext.Consumer>
            {(user) => {
              return (
                <div>
                <h4>Create a Post</h4>
                <div className="row">
                  <Mutation
                    mutation={addPost}
                    update={(cache, { data: { addPost } }) => {
                            const { posts } = cache.readQuery({ query: getPosts });
                            cache.writeQuery({
                              query: getPosts,
                              data: { posts: [addPost, ...posts]}
                            });
                          }}
                    >
                  {(addComment, { data }) => (
                <form className="col s12" onSubmit={(e) => {
                    e.preventDefault();
                    const newUser = user ? user.username : 'Anonymous';
                    addComment({variables: {
                      title: this.state.title,
                      body: this.state.body,
                      username: newUser,
                      date: new Date(),
                      comments: []
                    }})
                    this.props.history.goBack();
                  }
                  }>
                    <label>Title
                    <input name='title' type="text" value={this.state.title} onChange={this.handleChange}/>
                    </label>
                    <label>Body
                    <textarea className="materialize-textarea" name='body' type="text" value={this.state.body} onChange={this.handleChange}/>
                    </label>
                  <Button type="submit">Submit</Button>
                    <Link className="waves-effect waves-light btn red lighten-1 ml-1" to="/">Cancel</Link>
                </form>
              )}
                </Mutation>
                </div>
              </div>
              );
            }}
              </AuthContext.Consumer>
    </div>
    </div>
    </div>
);
  }
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }
}

export default CreatePost;
