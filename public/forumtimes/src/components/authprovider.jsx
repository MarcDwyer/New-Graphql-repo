import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { fetchUser, LocalUser, ChangeUser } from '../queries/queries';
export const AuthContext = React.createContext();

class AuthProvider extends Component {
  async componentDidMount() {
    const checker = JSON.parse(localStorage.getItem('token'));
    if (!checker) return;
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
    console.log(isValid)
    if (isValid.message) {
      localStorage.removeItem('token');
      this.props.changeUser({
        variables: {
            username: null,
            email: null,
            token: null
        }
      })
       this.props.history.push('/user-signin')
        return;
    }  this.props.changeUser({
          variables: {
              username: checker.username,
              email: checker.email,
              token: checker.token
          }
      })

  }

render() {
    return (
        <AuthContext.Provider value={this.props.user.getUser || this.props.theUser}>
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
