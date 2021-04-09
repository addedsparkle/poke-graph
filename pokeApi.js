const got = require("got");

const prefixUrl = "https://pokeapi.co/api/v2/";

module.exports = {
  getPokemon: () => got("pokemon", { prefixUrl }).then((response) => {
    const body = JSON.parse(response.body);
    return Array.isArray(body.results) ? body.results : [];
  }),

  getPokemonByName: (name) => got(`pokemon/${name}`, {prefixUrl}).then( response => JSON.parse(response.body)),

  getResource: (url) => got(url).then( response => JSON.parse(response.body)),
};
