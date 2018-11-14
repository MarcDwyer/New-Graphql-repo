import React, { Component } from 'react';
import {AuthContext} from './authprovider'
import { FormikApp } from './createform';

class CreatePost extends Component {
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
                <FormikApp user={user} />
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
