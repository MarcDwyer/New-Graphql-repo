import React from 'react';
import { ApolloConsumer } from 'react-apollo'
import { SignIn } from '../queries/queries';
import { Button } from 'react-materialize'
import { Form, Field, Formik } from 'formik'; 
import { compose, graphql } from 'react-apollo'
import { ChangeUser } from '../queries/queries'
import * as Yup from 'yup'
import Nav from './nav'


const validationSchema  = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Please enter a valid email'),
    password: Yup.string().required('Password is required').min(6)
  });

 const UserSignin = (props) => {

    console.log(props)
   const styles = {
        loginparent: {position:'fixed', display: 'flex', width: '100%', height: '100%'},
        logindiv: {width: '750px', margin:'45px auto auto auto'},
        logininfo: {display: 'flex', flexDirection: 'column'}
    }
    return (
        <div>
        <Nav />
        <div className="loginparent" style={styles.loginparent}>
        <div className="logindiv" style={styles.logindiv}>
            <div className="logininfo" style={styles.logininfo}>
            <ApolloConsumer>
            {client => (
                <Formik 
                initialValues={{email: '', password: ''}}
                validationSchema={validationSchema}
                onSubmit={async (values, action) => {
                    const { data } = await client.query({
                        query: SignIn,
                        variables: {email: values.email, password: values.password}
                    });
                    if (!data.nonAuthUser) {
                        action.setFieldError('password', 'Invalid password')
                        return;
                    }
                    const newData = data.nonAuthUser;
                    const stringed = JSON.stringify(newData)
                   localStorage.setItem('token', stringed);
                   props.changeUser({
                      variables: {
                       username: newData.username,
                       email: newData.email,
                       token: newData.token
                      }
                   }) 
                   props.history.push('/')
                }}
                render={({ values, touched, errors }) => (
                    <Form>
                        <label>
                            Email
                         { touched.email && errors.email && <p style={{color: "red"}}>{errors.email}</p>}
                        <Field type="text" name="email" value={values.email} />
                        </label>
                        <label>
                            Password
                         { touched.password && errors.password && <p style={{color: "red"}}>{errors.password}</p>}
                        <Field id="password" type="password" name="password" value={values.password} />
                        </label>
                        <Button type="submit">Sign in</Button>
                    </Form>
                )}
                />
            )}
            </ApolloConsumer>
            </div>
            </div>
            </div>
            </div>
    );
}

export default compose(
    graphql(ChangeUser, {name: 'changeUser'}),
)(UserSignin)
