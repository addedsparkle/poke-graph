const { PokeAPI } = require("./pokeApi");
const hawlucha = require("./test/fixtures/hawlucha");
const normalType = require("./test/fixtures/normal-type");

describe('The PokeApi',  () => {

  let pokeApi;

  beforeAll( () => {
    pokeApi = new PokeAPI();
    pokeApi.initialize({});
  })
  it("should fetch a list of pokemon", () => {
    return expect(pokeApi.getPokemon()).resolves.toHaveLength(20);
  });

  it("should fetch a single pokemon by name", () => {
    return expect(pokeApi.getPokemonByName("hawlucha")).resolves.toEqual(hawlucha);
  });

  it('should fetch a resource by url', () => {
    return expect(pokeApi.getResource('https://pokeapi.co/api/v2/type/1/')).resolves.toEqual(normalType);
  })
});