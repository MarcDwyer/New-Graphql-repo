import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { fetchUser } from '../queries/queries';

export const AuthContext = React.createContext();

class AuthProvider extends Component {
render() {

return (
  <AuthContext.Provider value={this.props.user.getUser}>
  {this.props.children}
</AuthContext.Provider>
);
}
}

export default compose(
  graphql(fetchUser, {name: "user"}),
)(AuthProvider);
