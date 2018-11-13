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
      <React.Fragment>
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper">
              <Link to="/" className="brand-logo">GraphQL Forums</Link>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                  {this.isUser(user)}
              </ul>
            </div>
          </nav>
          </div>
      </React.Fragment>
    )}
</AuthContext.Consumer>
  );
}
isUser(user) {
  if (!user) {
    return (
      <Dropdown trigger={
          <Button style={this.styles.button}>Sign In</Button>
        }>
        <NavItem href="http://localhost:5000/auth/google">Google+</NavItem>
      </Dropdown>

    );
  }
  return (
    <Dropdown trigger={
        <Button style={this.styles.button}>{user.username}</Button>
      }>
      <NavItem href="http://localhost:5000/auth/logout">Sign Out</NavItem>
    </Dropdown>
  )
}
}

export default Nav;
