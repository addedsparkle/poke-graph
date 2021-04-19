const { ApolloServer, gql } = require("apollo-server");
const { PokeAPI } = require('./pokeApi');
const { TrainerAPI } = require("./trainerApi");

const typeDefs = gql`
  type Pokemon {
    name: String
    id: Int
    types: [Type]
    sprites: Sprites
    url: String
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
      pokeApi: new PokeAPI(),
      trainerApi: new TrainerAPI()
    }
  },
  tracing: true,
 });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
