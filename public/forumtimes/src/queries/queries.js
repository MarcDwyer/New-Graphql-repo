import { gql } from 'apollo-boost';

const fetchUser = gql`
{
  getUser{
    id
    username
    googleId
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
mutation($title: String!, $body: String!, $username: String, $date: String) {
  addPost(title: $title, body: $body, username: $username, date: $date) {
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

export { getPosts, addPost, fetchUser, addComment, FullPost, RemovePost };
