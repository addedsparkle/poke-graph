const { ApolloServer, gql } = require('apollo-server');
const PokeAPI = require('./pokeApi');
const TrainerAPI = require('./trainerApi');

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
    double_damage_to: [Type]
    half_damage_from: [Type]
    half_damage_to: [Type]
    no_damage_from: [Type]
    no_damage_to: [Type]
  }

  type Query {
    pokemons: [Pokemon]
    trainer(name: String): Trainer
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
    addTrainerPokemon(name: String, pokemon: [PokemonInput]): TrainerUpdateResponse
  }
`;

const resolvers = {
  Query: {
    pokemons: (_source, _args, {dataSources}) => dataSources.pokeApi.getPokemon(),
    pokemon: (_source, {name}, {dataSources}) => dataSources.pokeApi.getPokemonByName(name),
    trainer: (_source, {name}, {dataSources}) => dataSources.trainerApi.getTrainer(name),
  },
  Mutation: {
    addTrainerPokemon: (_source, {name, pokemon}, {dataSources}) => dataSources.trainerApi.addPokemon(name, pokemon),
  },
  Pokemon: {
    types: (_source, _args, {dataSources}) => Promise.all(_source.types.map(({type}) => dataSources.pokeApi.getResource(type.url))),
    image: (_source, _args) => _source.sprites.front_default
  },
  Type: {
    double_damage_from: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.double_damage_from.map( type => dataSources.pokeApi.getResource(type.url))),
    double_damage_to: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.double_damage_to.map( type => dataSources.pokeApi.getResource(type.url))),
    half_damage_from: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.half_damage_from.map( type => dataSources.pokeApi.getResource(type.url))),
    half_damage_to: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.half_damage_to.map( type => dataSources.pokeApi.getResource(type.url))),
    no_damage_from: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.no_damage_from.map( type => dataSources.pokeApi.getResource(type.url))),
    no_damage_to: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.no_damage_to.map( type => dataSources.pokeApi.getResource(type.url)))
  },
  Trainer: {
    pokemon: (_source,_args, {dataSources}) => Promise.all(_source.pokemon.map(pokemon => dataSources.pokeApi.getResource(pokemon.url))),
  }
};

const trainerApi = new TrainerAPI();
const pokeApi = new PokeAPI();

const server = new ApolloServer({ 
  typeDefs,
  resolvers, 
  dataSources: () => {
    return {
      pokeApi,
      trainerApi
    }
  },
  tracing: true,
 });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
