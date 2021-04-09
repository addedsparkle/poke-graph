const { ApolloServer, gql } = require("apollo-server");
const pokeApi = require('./pokeApi');

const typeDefs = gql`
  type Pokemon {
    name: String
    id: Int
  }

  type Query {
    pokemon: [Pokemon]
  }
`;

const resolvers = {
  Query: {
    pokemon: () => pokeApi.getPokemon(),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
