const pokeApi = require("./pokeApi");
const hawlucha = require("./test/fixtures/hawlucha");

it("should fetch a list of pokemon", () => {
  expect(pokeApi.getPokemon()).resolves.toHaveLength(20);
});

it("should fetch a single pokemon by name", () => {
  expect(pokeApi.getPokemonByName("hawlucha")).resolves.toEqual(hawlucha);
});
