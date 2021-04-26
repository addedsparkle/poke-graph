const got = require('got');
const prefixUrl = "https://pokeapi.co/api/v2";

class PokeAPI {

  async get(url) {
    return got(url).then((response) => JSON.parse(response.body))
  }

  async getPokemon () {
    return this.get(`${prefixUrl}/pokemon`).then((response) => {
      return Array.isArray(response.results) ? response.results : [];
    });
  }
};

module.exports = { PokeAPI };