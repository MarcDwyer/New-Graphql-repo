import React, { Component } from 'react';
import { Navbar, NavItem, Dropdown, Button } from 'react-materialize';
import {AuthContext} from './authprovider';
import { Link } from 'react-router-dom';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      button: {marginRight: '25px'}
    }
  }

  render() {

  return (
  <AuthContext.Consumer>
    {(user) => (
          <Navbar fixed>
              <Link to="/" className="brand-logo"> Forum App</Link>
              {this.isUser(user)}
          </Navbar>
    )}
</AuthContext.Consumer>
  );
}
isUser(user) {
  if (!user) {
    return (
      <Dropdown trigger={
          <Button className="signin" style={this.styles.button}>Sign In</Button>
        }>
        <NavItem href="/auth/google">Google+</NavItem>
      </Dropdown>
    );
  }
  return (
    <Dropdown trigger={
        <Button className="signin" style={this.styles.button}>{user.username}</Button>
      }>
      <NavItem href="/auth/logout">Sign Out</NavItem>
    </Dropdown>
  )
}
}

export default Nav;
