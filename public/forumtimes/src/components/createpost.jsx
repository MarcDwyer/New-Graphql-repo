import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql, compose} from 'react-apollo';
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
                <form className="col s12" onSubmit={(e) => this.handleSubmit(e, user)}>
                    <label>Title
                    <input name='title' type="text" value={this.state.title} onChange={this.handleChange}/>
                    </label>
                    <label>Body
                    <textarea className="materialize-textarea" name='body' type="text" value={this.state.body} onChange={this.handleChange}/>
                    </label>
                  <Button type="submit">Submit</Button>
                    <Link className="waves-effect waves-light btn red lighten-1 ml-1" to="/">Cancel</Link>
                </form>
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
  handleSubmit = (e, user) => {
    console.log({e, user});
    e.preventDefault();
    const newUser = user ? user.username : 'Anonymous';
    this.props.addPost({
      variables: {
        title: this.state.title,
        body: this.state.body,
        username: newUser,
        date: new Date()
      },
      refetchQueries: [{ query: getPosts}]
    })
    this.setState({
      title: '',
      body: ''
    });
    this.props.history.push('/');
  }
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }
}

export default compose(
  graphql(addPost, {name: "addPost"}),
)(CreatePost);
