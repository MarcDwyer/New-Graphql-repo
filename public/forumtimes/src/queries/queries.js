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
  }
}
`;

const addPost = gql`
mutation($title: String!, $body: String!, $username: String, $date: String) {
  addPost(title: $title, body: $body, username: $username, date: $date) {
    title
    body
  }
}
`;



export { getPosts, addPost, fetchUser };
