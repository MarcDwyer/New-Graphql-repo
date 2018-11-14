import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from "apollo-link-http";


import './index.css';
import { PostList } from './components/post_list';
import AuthProvider from './components/authprovider';

const cache = new InMemoryCache();

const link = createHttpLink({
  uri: '/graph',
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
  link
]),
})

ReactDOM.render(
<ApolloProvider client={client}>
<AuthProvider>
<BrowserRouter>
<Switch>
<Route path='/' component={PostList} />
</Switch>
</BrowserRouter>
</AuthProvider>
</ApolloProvider>
, document.getElementById('root'));
serviceWorker.unregister();
