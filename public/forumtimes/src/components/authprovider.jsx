import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { fetchUser } from '../queries/queries';

export const AuthContext = React.createContext();

class AuthProvider extends Component {
 constructor(props) {
   super(props);
   this.state = {
    user: null
   }
 }
  componentDidMount() {
    if (!document.cookie) return;
    const newUser = JSON.parse(document.cookie);
    newUser.isToken = true;
    this.setState({user: newUser.nonAuthUser});
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props && this.props.user.getUser) {
      this.setState({user: this.props.user.getUser})
    }
  }
render() {
return (
  <AuthContext.Provider value={this.state.user}>
  {this.props.children}
</AuthContext.Provider>
);
}
}

export default compose( 
  graphql(fetchUser, {name: "user"}),
)(AuthProvider);
