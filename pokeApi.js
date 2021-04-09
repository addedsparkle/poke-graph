const got = require("got");

const prefixUrl = "https://pokeapi.co/api/v2/";

module.exports = {
  getPokemon: () => {
    return got("pokemon", { prefixUrl }).then((response) => {
      const body = JSON.parse(response.body);
      return Array.isArray(body.results) ? body.results : [];
    });
  },
};
