import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { SignUp } from '../queries/queries';
import { Button } from 'react-materialize'
import { Form, Field, Formik } from 'formik'; 
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import Nav from './nav'


const validationSchema  = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Please enter a valid email'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required').min(6)
  });

export default class UserSignup extends Component {
    styles ={
        loginparent: {position:'fixed', display: 'flex', width: '100%', height: '100%'},
        logindiv: {width: '750px', margin:'45px auto auto auto'},
        logininfo: {display: 'flex', flexDirection: 'column'}
    }
    state = {
        isValid: false
    }
  render() {

    return (
      <div>
        <Nav />
        <div className="loginparent" style={this.styles.loginparent}>
        <div className="logindiv" style={this.styles.logindiv}>
            <div className="logininfo" style={this.styles.logininfo}>
            <Link to="/user-signin" style={{marginBottom: '45px', color: 'green'}}>Already a user? Click here to sign in.</Link>
            <Mutation 
            mutation={SignUp}
            onCompleted={(data) => {
                this.setState({isValid: data});
            }}
            >
            {(signUp, { data }) => (
                <Formik
                initialValues={{username: '', password: '', email: ''}}
                onSubmit={(values, action) => {

                    signUp({
                        variables: 
                        {email: values.email,
                        username: values.username,
                        password: values.password}
                    });
                }}
                validationSchema={validationSchema}
                render={({ values, touched, errors }) => {
                    return (
                        <Form>
                        {this.handleSign()}
                    <div>
                    <label>Email
                        <div>
                    { touched.email && errors.email && <p style={{color: "red"}}>{errors.email}</p>}
                        <Field name="email" type="text" values={values.email} />
                        </div>       
                   </label> 
                </div>
                <div>
                    <label>Username
                    { touched.username && errors.username && <p style={{color: "red"}}>{errors.username}</p>}
                        <Field name="username" type="text" values={values.username} /> 
                     </label> 
                </div>   
                <div>
                    <label>Password
                    { touched.password && errors.password && <p style={{color: "red"}}>{errors.password}</p>}
                        <Field name="password" type="text" values={values.password} />     
                   </label> 
                   </div>
                   <Button type="submit">Sign Up</Button>
                </Form>
                    );       
            }}
                />
            )}
            </Mutation>
            </div>
        </div>
        </div>
      </div>
    )
  }
  handleSign = () => {
    const { isValid } = this.state;
      if (isValid && !isValid.signUp.id) {
          return (
            <h5 style={{color: 'red'}}>Email is already being used...</h5>
          ) 
      } else if (isValid && isValid.signUp.id) {
          setTimeout(() => {
              this.props.history.push('/user-signin')
          }, 1500);
          return (
            <h5>Success!</h5>
          );
      }
  }
}
