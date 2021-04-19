const { ApolloServer, gql } = require("apollo-server");
const pokeApi = require('./pokeApi');

const typeDefs = gql`
  type Pokemon {
    name: String
    id: Int
    types: [Type]
    sprites: Sprites
  }

  type Sprites {
    front_default: String
  }

  type Type {
    name: String
    damage_relations: DamageRelations
    pokemon: [Pokemon]
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
    types: (parent) => parent.types.map(({type}) => type),
    sprites: (parent) => pokeApi.getResource(parent.url).then(response => response.sprites)
  },
  Type: {
    damage_relations: (parent) => pokeApi.getResource(parent.url).then(response => response.damage_relations),
    pokemon: (parent) => pokeApi.getResource(parent.url).then(response => response.pokemon.map(({pokemon}) => pokemon))
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
