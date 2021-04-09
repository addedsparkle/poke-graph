const pokeApi = require("./pokeApi");
const hawlucha = require("./test/fixtures/hawlucha");
const normalType = require("./test/fixtures/normal-type");

it("should fetch a list of pokemon", () => {
  expect(pokeApi.getPokemon()).resolves.toHaveLength(20);
});

it("should fetch a single pokemon by name", () => {
  expect(pokeApi.getPokemonByName("hawlucha")).resolves.toEqual(hawlucha);
});

it('should fetch a resource by url', () => {
  expect(pokeApi.getResource('https://pokeapi.co/api/v2/type/1/')).resolves.toEqual(normalType);
})