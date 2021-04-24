const { ApolloServer, gql } = require('apollo-server');
const { PokeAPI } = require('./pokeApi');
const { TrainerAPI } = require('./trainerApi');

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
    double_damage_from: [Type] 
    pokemon: [Pokemon]
  }

  type Query {
    pokemons: [Pokemon]
    pokemon(name: String!): Pokemon
  }

  type Trainer {
    name: String
    pokemon: [Pokemon]
  }

  type TrainerUpdateResponse {
    success: Boolean!
    trainer: Trainer
  }

  input PokemonInput {
    name: String
    url: String
  }

  type Mutation {
    addPokemons(name: String, pokemon: [PokemonInput]): TrainerUpdateResponse
  }
`;

const resolvers = {
  Query: {
    pokemons: (_source, _args, {dataSources}) => dataSources.pokeApi.getPokemon(),
    pokemon: (_source, {name}, {dataSources}) => dataSources.pokeApi.getPokemonByName(name),
  },
  Mutation: {
    addPokemons: async (_source, {name, pokemon}, {dataSources}) => dataSources.trainerApi.addPokemon(name, pokemon),
  },
  Pokemon: {
    types: (_source) => _source.types.map(({type}) => type),
    image: (_source, _args, {dataSources}) => dataSources.pokeApi.getResource(_source.url).then(response => response.sprites.front_default)
  },
  Type: {
    double_damage_from: (_source, _args, {dataSources}) => dataSources.pokeApi.getResource(_source.url).then(response => response.damage_relations.double_damage_from),
    pokemon: (_source, _args, {dataSources}) => dataSources.pokeApi.getResource(_source.url).then(response => response.pokemon.map(({pokemon}) => pokemon))
  }
};

const server = new ApolloServer({ 
  typeDefs,
  resolvers, 
  dataSources: () => {
    return {
      pokeApi: new PokeAPI(),
      trainerApi: new TrainerAPI()
    }
  },
  tracing: true,
 });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
