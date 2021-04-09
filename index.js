const { ApolloServer, gql } = require("apollo-server");
const pokeApi = require('./pokeApi');

const typeDefs = gql`
  type Pokemon {
    name: String
    id: Int
    types: [Type]
  }

  type Type {
    name: String
    damage_relations: DamageRelations
  }

  type DamageRelations {
    double_damage_from: [Type]
    double_damage_to: [Type]
    half_damage_from: [Type]
    half_damage_to: [Type]
    no_damage_from: [Type]
    no_damage_to: [Type]
  }
  
  type Query {
    pokemons: [Pokemon]
    pokemon(name: String!): Pokemon
  }
`;

const resolvers = {
  Query: {
    pokemons: () => pokeApi.getPokemon(),
    pokemon: (parent, {name}) => pokeApi.getPokemonByName(name),
  },
  Pokemon: {
    types: (parent) => parent.types.map(({type}) => pokeApi.getResource(type.url))
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`);
});
