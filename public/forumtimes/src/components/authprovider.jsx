import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { fetchUser, LocalUser, ChangeUser } from '../queries/queries';
export const AuthContext = React.createContext();

class AuthProvider extends Component {
 constructor(props) {
   super(props);
   this.state = {
    user: null
   }
 }
  async componentDidMount() {
    const checker = JSON.parse(localStorage.getItem('token'));
    if (!checker) return;
    this.props.changeUser({
        variables: {
            username: checker.username,
            email: checker.email,
            token: checker.token
        }
    })
    if (!this.props.theUser) return;

    const sendToken = await fetch('/authenticate', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
    },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(checker)
    });
    const isValid = await sendToken.json();
    if (isValid.message && isValid.message.includes('expired')) {
      localStorage.removeItem('token');
      this.props.changeUser({
        variables: {
            username: null,
            email: null,
            token: null
        }
      })
       this.props.history.push('/user-signin')
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props && this.props.user.getUser) {
      this.setState({user: this.props.user.getUser})
    }
  }
render() {
return (
  <AuthContext.Provider value={this.state.user || this.props.theUser}>
  {this.props.children}
</AuthContext.Provider>
);
}
}

export default compose(
  withRouter, 
  graphql(fetchUser, {name: "user"}),
  graphql(LocalUser, {
    props: ({ data: { theUser } }) => ({
      theUser
    })
  }),
  graphql(ChangeUser, {name: 'changeUser'})
)(AuthProvider);
