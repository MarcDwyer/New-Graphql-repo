import React from 'react';
import {AuthContext} from './authprovider'
import { Mutation } from 'react-apollo';
import { addPost, getPosts } from '../queries/queries';
import { Button } from 'react-materialize';
import { Link } from 'react-router-dom';
import { Form, Field, Formik } from 'formik';
import * as Yup from 'yup'

const validationSchema  = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  body: Yup.string().min(9, 'Minimun 9 characters please').required('Body is required')
});

const TheForm = (props) => {
  return (
    <Mutation 
    mutation={addPost}
    update={(cache, { data: { addPost } }) => {
      const { posts } = cache.readQuery({ query: getPosts });
      cache.writeQuery({
        query: getPosts,
        data: { posts: [addPost, ...posts]}
      });
    }}
    >
      {(addComment, { data }) => (
    <Formik
    initialValues={{title: '', body: ''}}
    onSubmit={(values, actions) => {  
      const newuser = props.user ? props.user.email : "Anonymous";
      const userName = props.user ? props.user.username : "Anonymous";

      addComment({
        variables: {
          title: values.title,
          body: values.body,
          email: newuser,
          username: userName,
          date: new Date()
        },
      })
      props.history.goBack();
    }}
    validationSchema={validationSchema}
    render={({ values, touched, errors }) => {
        
      return (
        
      <Form>
        <h4>Create a post</h4>
      <label>Title
        <div>
        { touched.title && errors.title && <p style={{color: "red"}}>{errors.title}</p>}
      <Field name='title' type="text" value={values.title} />
      </div>
      </label>
      <label>Body
        <div>
        { touched.body && errors.body && <p style={{color: "red"}}>{errors.body}</p>}
      <Field className="materialize-textarea" name='body' type="text" value={values.body} />
      </div>
      </label>
    <Button type="submit">Submit</Button>
      <Link className="waves-effect waves-light btn red lighten-1 ml-1" to="/">Cancel</Link>
  </Form>
    );
  }
    }
    />
      )}
    </Mutation>
  )
  }


export const CreatePost = (props) => {

    return (
    <div className="topmodal">
      <div className="modaldiv postcreator">
        <div className="container makewhite mt-3">
          <AuthContext.Consumer>
            {(user) => {
              return (
                  <TheForm user={user} history={props.history} />
              );
            }}
              </AuthContext.Consumer>
    </div>
    </div>
    </div>
);

}
