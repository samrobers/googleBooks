const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Profile {
    profileId: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Book {
    _id: ID!
    bookId: String!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }
  type Auth {
    token: ID!
    profile: Profile
  }
  type Query {
    profiles: [Profile]
  }
  type Mutation {
    saveBook(
      authors: [String]
      description: String
      bookId: String
      image: String
      link: String
      title: String
    ): Profile
    removeBook(_id: ID!): Profile
    logIn(email: String!, password: String!): Auth
    signUp(username: String!, email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
