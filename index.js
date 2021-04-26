const { ApolloServer, gql, SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver, GraphQLString } = require('graphql');
const { PokeAPI } = require('./pokeApi');
const { TrainerAPI } = require('./trainerApi');

class ifInVersionDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.args.push({
      name: 'version',
      type: GraphQLString
    });
    field.resolve = async function (source, {version, ...otherArgs}, context, info) {
      const pokemonList = await resolve.call(this, source, otherArgs, context, info);
      return pokemonList.filter( pokemon => pokemon.game_indices && pokemon.game_indices.find(gameIndex => gameIndex.version.name === version));
    };
  }
};

const typeDefs = gql`

  directive @ifInVersion(version: String) on FIELD_DEFINITION

  type Pokemon {
    name: String
    id: Int
    types: [Type]
    url: String
    image: String
    game_indices: [GameIndex] 
  }

  type GameIndex {
    game_index: Int
    version: Version
  }

  type Version {
    name: String
    url: String
  }
  type Type {
    name: String
    double_damage_from: [Type] 
    double_damage_to: [Type]
    half_damage_from: [Type]
    half_damage_to: [Type]
    no_damage_from: [Type]
    no_damage_to: [Type]
    pokemon: [Pokemon] @ifInVersion
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
    types: (_source, _args, {dataSources}) => Promise.all(_source.types.map(({type}) => dataSources.pokeApi.getResource(type.url))),
    image: (_source, _args) => _source.sprites.front_default
  },
  Type: {
    double_damage_from: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.double_damage_from.map( type => dataSources.pokeApi.getResource(type.url))),
    double_damage_to: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.double_damage_to.map( type => dataSources.pokeApi.getResource(type.url))),
    half_damage_from: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.half_damage_from.map( type => dataSources.pokeApi.getResource(type.url))),
    half_damage_to: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.half_damage_to.map( type => dataSources.pokeApi.getResource(type.url))),
    no_damage_from: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.no_damage_from.map( type => dataSources.pokeApi.getResource(type.url))),
    no_damage_to: (_source, _args, {dataSources}) => Promise.all(_source.damage_relations.no_damage_to.map( type => dataSources.pokeApi.getResource(type.url))),
    pokemon: (_source, _args, {dataSources}) => Promise.all(_source.pokemon.map(({pokemon}) => dataSources.pokeApi.getResource(pokemon.url)))
  }
};

const server = new ApolloServer({ 
  typeDefs,
  schemaDirectives: {
    ifInVersion: ifInVersionDirective
  },
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
