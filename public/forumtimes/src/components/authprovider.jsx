import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { fetchUser } from '../queries/queries';
export const AuthContext = React.createContext();

class AuthProvider extends Component {
 constructor(props) {
   super(props);
   this.state = {
    user: null
   }
 }
  async componentDidMount() {
    console.log(withRouter)
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) return;
    const sendToken = await fetch('/authenticate', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
    },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(token)
    });
    const isValid = await sendToken.json();
    if (isValid.message && isValid.message.includes('expired')) {
      localStorage.removeItem('token');
       this.props.history.push('/user-signin')
    }

    this.setState({user: token});
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props && this.props.user.getUser) {
      this.setState({user: this.props.user.getUser})
    }
  }
render() {
  console.log(this.state)
return (
  <AuthContext.Provider value={this.state.user}>
  {this.props.children}
</AuthContext.Provider>
);
}
}

export default compose(
  withRouter, 
  graphql(fetchUser, {name: "user"}),
)(AuthProvider);
