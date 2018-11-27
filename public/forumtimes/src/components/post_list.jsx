import React from 'react';
import Nav from './nav';
import { Query } from 'react-apollo';
import {Collection, CollectionItem } from 'react-materialize';
import { getPosts } from '../queries/queries';
import { Route, Link } from 'react-router-dom';
import uuid from 'uuid';

import ViewPost from './viewpost';
import { CreatePost } from './createpost';


export const PostList = (props) => {

  return(
  <Query query={getPosts}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;
        return (
          <div>
            <Nav />
              <Route path={`/posts/:id`} component={ViewPost} />
              <Route path='/create-post' component={CreatePost}/>
          <div className="contained">
            <h4>Recent Posts</h4>
            <Link className='waves-effect waves-light btn' to='/create-post'>Create Post</Link>
            <div className="comments">
            <Collection>
              {data.posts.map(({ title, username, commentLength, id }) => {
              const path = `/posts/${id}`;
              return (
              <Link to={path} key={uuid()}>
              <CollectionItem>
              <strong>{title}</strong> <br/>
                <span>Created by <strong>{username}</strong></span> <br />
                  <span>{commentLength > 0 ? commentLength : '0'} <small>Comments</small></span>
                </CollectionItem>
                  </Link>
                );
              })}
            </Collection>
            </div>
          </div>
          </div>
        );
      }}
    </Query>
  );
}
