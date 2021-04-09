const pokeApi = require("./pokeApi");
const hawlucha = require("./test/fixtures/hawlucha");

it("should fetch a list of pokemon", () => {
  expect(pokeApi.getPokemon()).resolves.toHaveLength(20);
});
