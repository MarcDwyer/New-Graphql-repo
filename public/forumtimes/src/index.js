import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink, } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { createHttpLink } from "apollo-link-http";


import './index.css';
import { PostList } from './components/post_list';
import AuthProvider from './components/authprovider';
import UserPosts from './components/user-posts';
import UserSignUp from './components/user_signup'
import  UserSignin  from './components/user-signin'
 

const cache = new InMemoryCache();

const link = createHttpLink({
  uri: '/graph',
});

const stateLink = withClientState({
  cache,
  defaults: {
    theUser: {
        __typename: 'CurrentUser',
        username: null,
        email: null,
        token: null
    }
  },
  resolvers: {
    Mutation: {
      updateUser: (_,  theUser, { cache }) => {
        theUser.__typename = 'CurrentUser'
        cache.writeData({data: {theUser} })
        return null
    }
  }
}
})

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
  stateLink,
  link
]),
})



ReactDOM.render(
<ApolloProvider client={client}>
<BrowserRouter>
<AuthProvider>
<Switch>
<Route exact path="/user-signup" component={UserSignUp} />
<Route exact path="/user-signin" component={UserSignin} />
<Route path='/user-posts' component={UserPosts} />
<Route path='/' component={PostList} />
</Switch>
</AuthProvider>
</BrowserRouter>
</ApolloProvider>
, document.getElementById('root'));
serviceWorker.unregister();
