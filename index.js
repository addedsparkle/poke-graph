const { ApolloServer, gql } = require("apollo-server");
const PokeApi = require('./pokeApi');

const typeDefs = gql`
  type Pokemon {
    name: String
    id: Int
  }

  type Query {
    pokemons: [Pokemon]
  }
`;

const pokeApi = new PokeApi();

const resolvers = {
  Query: {
    pokemons: () => pokeApi.getPokemon(),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
