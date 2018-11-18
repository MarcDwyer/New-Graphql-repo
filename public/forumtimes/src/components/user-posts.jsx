import React from 'react';
import { Query } from 'react-apollo';
import { UserPostQuery } from '../queries/queries';
import {Collection, CollectionItem } from 'react-materialize';
import {AuthContext} from './authprovider';
import Nav from './nav';
import ViewPost from './viewpost';
import { Link, Route } from 'react-router-dom';

export const UserPosts = (props) => {

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
                    } else if (user.googleId !== props.match.params.user) {
                        return (
                            <h2>Incorrect User</h2>
                        );
                    }
                    return (
                        <Query query={UserPostQuery} variables={{id: props.match.params.user}}>
                        {({ loading, error, data }) => {
                            if (loading) return 'Loading...'
                          return (
                              <React.Fragment>
                              <Nav />
                              <Route path={`${props.match.url}/:id`} component={ViewPost} />
                              <div className="contained">
                              <h4>Your Posts</h4>
                                <Collection>
                                {data.userPost.map(({ id, title, username, commentLength }) => {
                                    const path = `${props.match.url}/${id}`;
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
};

