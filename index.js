const { ApolloServer, gql } = require('apollo-server');
const PokeAPI = require('./pokeApi');

const typeDefs = gql`
  type Pokemon {
    name: String
    id: Int
    types: [Type]
    url: String
    image: String
  }

  type Type {
    name: String
  }

  type Query {
    pokemons: [Pokemon]
    pokemon(name: String!): Pokemon
  }
`;

const resolvers = {
  Query: {
    pokemons: (_source, _args, {dataSources}) => dataSources.pokeApi.getPokemon(),
    pokemon: (_source, {name}, {dataSources}) => dataSources.pokeApi.getPokemonByName(name),
  },
  Pokemon: {
    types: (_source, _args, {dataSources}) => Promise.all(_source.types.map(({type}) => dataSources.pokeApi.getResource(type.url))),
    image: (_source, _args) => _source.sprites.front_default
  }
};

const server = new ApolloServer({ 
  typeDefs,
  resolvers, 
  dataSources: () => {
    return {
      pokeApi: new PokeAPI()
    }
  },
  tracing: true,
 });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
