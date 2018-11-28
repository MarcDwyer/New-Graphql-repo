import React, { Component } from 'react';
import { NavItem, Dropdown, Button } from 'react-materialize';
import { AuthContext } from './authprovider';
import { compose, graphql } from 'react-apollo';
import { ChangeUser} from "../queries/queries"
import { Link } from 'react-router-dom';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      nav : {backgroundColor: '#38435a !important'},
      button: {marginRight: '25px'}
    }
  }
  render() {
  return (
  <AuthContext.Consumer>
    {(user) => (
      <div className="navbar-fixed">
        <nav className="fixer">
          <div className="nav-flex">
          <Link to="/" className="brand-logo left">Readitor</Link>
          {this.isUser(user)}
          </div>
        </nav>
      </div>
    )}
</AuthContext.Consumer>
  );
}
isUser(user) {
  if (!user.username) {
    return (
      <Dropdown trigger={
          <Button className="signbut" style={this.styles.button}>Sign In</Button>
        }>
        <NavItem href="/auth/google">Google+</NavItem>
        <li>
        <Link to="/user-signup">Sign in</Link>
        </li>
      </Dropdown>

    );
  }

  return (
    <Dropdown trigger={
        <Button className="signbut" style={this.styles.button}>{user.username}</Button>
      }>
     <Link style={{color: '#26a69a'}} to='/user-posts'>Check Posts</Link>
        {this.signOut(user)}
    </Dropdown>
  )
}
signOut(user) {
      if (user.googleId) {
          return (<NavItem href="/auth/logout">Sign Out</NavItem>)
      } else {
          return (
              <NavItem onClick={() => {
                  localStorage.removeItem('token')
                  this.props.changeUser({variables: {
                      username: null,
                          email: null,
                          token: null
                      }})
              }}>Sign Out</NavItem>
          );
      }

}
}

export default compose(
    graphql(ChangeUser, {name: 'changeUser'}),
)(Nav)
