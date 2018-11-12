import React, { Component } from 'react';
import Nav from './nav';
import { graphql, compose } from 'react-apollo';
import {Collection, CollectionItem } from 'react-materialize';
import { getPosts } from '../queries/queries';
import { Route, Link } from 'react-router-dom';

import ViewPost from './viewpost';
import CreatePost from './createpost';
class PostList extends Component {
  render() {
    const { posts } = this.props.getPosts;
    if (!posts) return (
      <h3>Loading Posts...</h3>
    );

    return (
      <div>
        <Nav />
          <Route path={`/posts/:id`} component={ViewPost} />
          <Route path='/create-post' component={CreatePost}/>
      <div className="container">
        <h3>Recent Posts</h3>
        <Link className='waves-effect waves-light btn' to='/create-post'>Create Post</Link>
            <Collection>
              {this.handlePosts()}
            </Collection>
      </div>
      </div>
    );
  }
  handlePosts() {
    const { posts } = this.props.getPosts;
    const { match } = this.props;
  return posts.map(({ title, body, id, username }) => {
    const path = `/posts/${id}`;
    return (
      <Link to={path} key={id}>
      <CollectionItem>
      <strong>{title}</strong> <br/>
      <span>Created by <strong>{username}</strong></span>
      </CollectionItem>
      </Link>
    );
  })
  }
}

export default compose(
  graphql(getPosts, {name: "getPosts"}),
)(PostList);
