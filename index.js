const { ApolloServer, gql } = require("apollo-server");
const { PokeAPI } = require('./pokeApi');

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
    pokemons: (_source, _args, {dataSources}) => dataSources.pokeApi.getPokemon(),
    pokemon: (_source, {name}, {dataSources}) => dataSources.pokeApi.getPokemonByName(name),
  },
  Pokemon: {
    types: (_source) => _source.types.map(({type}) => type),
    sprites: (_source, _args, {dataSources}) => dataSources.pokeApi.getResource(_source.url).then(response => response.sprites)
  },
  Type: {
    damage_relations: (_source, _args, {dataSources}) => dataSources.pokeApi.getResource(_source.url).then(response => response.damage_relations),
    pokemon: (_source, _args, {dataSources}) => dataSources.pokeApi.getResource(_source.url).then(response => response.pokemon.map(({pokemon}) => pokemon))
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
