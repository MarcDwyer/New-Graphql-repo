import { gql } from 'apollo-boost';

const fetchUser = gql`
{
  getUser{
    id
    username
    googleId
    email
  }
}
`;

const getPosts = gql`
{
 posts{
    id
    title
    username
    commentLength
  }
}
`;

const addPost = gql`
mutation($title: String!, $body: String!, $email: String!, $username: String!, $date: String) {
  addPost(title: $title, body: $body, email: $email, username: $username, date: $date) {
    id
    title
    username
    commentLength
  }
}
`;

const FullPost = gql`
   query($id: ID!) {
    post(id: $id){
      id
      title
      body
      username
      googleId
      comments {
        username
        comment
      }
    }
  }
`;

const addComment = gql`
  mutation($id: ID!, $username: String!, $comment: String!) {
    addComment(id: $id, username: $username, comment: $comment){
      id
      commentLength
      comments {
        username
        comment
      }
    }
  }
`;

const RemovePost = gql`
mutation($id: ID!) {
  removePost(id: $id){
    title
  }
}
`;

const UserPostQuery = gql`
query($email: String!) {
  userPost(email: $email) {
    id
    title
    username
    commentLength

  }
}
`;

const SignUp = gql`
mutation($username: String!, $password: String!, $email: String!) {
  signUp(username: $username, password: $password, email: $email) {
    id
    username
    email
  }
}
`;

const SignIn = gql`
query($email: String!, $password: String!) {
  nonAuthUser(email: $email, password: $password) {
    id
    email
    username
    token
  }
}
`;

const LocalUser = gql`
query {
  theUser @client {
        username
        email
        token
}
}
`;

const ChangeUser = gql`
mutation updateUser($username: String!, $email: String!, $token: String!) {
  updateUser(username: $username, email: $email, token: $token) @client 
}
`;
export { getPosts, addPost, fetchUser, addComment, FullPost, RemovePost, UserPostQuery, SignUp, SignIn, LocalUser, ChangeUser };
