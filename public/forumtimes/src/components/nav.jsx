import React, { Component } from 'react';
import { NavItem, Dropdown, Button } from 'react-materialize';
import {AuthContext} from './authprovider';
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
          <Link to="/" className="brand-logo left">Forum App</Link>
          {this.isUser(user)}
          </div>
        </nav>
      </div>
    )}
</AuthContext.Consumer>
  );
}
isUser(user) {
  if (!user) {
    return (
      <Dropdown trigger={
          <Button className="signbut" style={this.styles.button}>Sign In</Button>
        }>
        <NavItem href="http://localhost:5000/auth/google">Google+</NavItem>
      </Dropdown>

    );
  }
  const path = `/user-posts/${user.googleId}`;
  return (
    <Dropdown trigger={
        <Button className="signbut" style={this.styles.button}>{user.username}</Button>
      }>
     <Link style={{color: '#26a69a'}} to={path}>Check Posts</Link>
      <NavItem href="http://localhost:5000/auth/logout">Sign Out</NavItem>
    </Dropdown>
  )
}
}

export default Nav;
