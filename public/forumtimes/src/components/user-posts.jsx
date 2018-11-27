import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { UserPostQuery } from '../queries/queries';
import {Collection, CollectionItem } from 'react-materialize';
import {AuthContext} from './authprovider';
import Nav from './nav';
import ViewPost from './viewpost';
import { Link, Route } from 'react-router-dom';

export default class UserPosts extends Component{
  
    render() {
        return (
            <AuthContext.Consumer>
                {(user) => {
                    if (!user) {
                        return (
                            <div>
                            <Nav />
                            <h2>sign in please....</h2>
                            </div>
                        );
                    }
                    return (
                        <Query query={UserPostQuery} variables={{email: user.email}}>
                        {({ loading, error, data }) => {
                            if (loading) return 'Loading...'
                          return (
                              <React.Fragment>
                              <Nav />
                              <Route path={`${this.props.match.url}/:id`} component={ViewPost} />
                              <div className="contained">
                              <h4>Your Posts</h4>
                                <Collection>
                                {data.userPost.map(({ id, title, username, commentLength }) => {
                                    const path = `${this.props.match.url}/${id}`;
                                      return (
                                         <Link to={path} key={id}>
                                        <CollectionItem>
                                        <strong>{title}</strong> <br/>
                                          <span>Created by <strong>{username}</strong></span> <br />
                                            <span>{commentLength > 0 ? commentLength : '0'} <small>Comments</small></span>
                                          </CollectionItem>
                                          </Link>
                                      );
                                  })
                                }
                                </Collection>
                              </div>
                              </React.Fragment>
                          );          
                            }}
                    </Query> 
                    );
                }}
            </AuthContext.Consumer>
        );
}
}

