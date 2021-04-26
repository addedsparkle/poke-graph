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

  async getPokemonByName (name) { 
    return this.get(`${prefixUrl}/pokemon/${name}`);
  }

  async getResource(url) {
    return this.get(url);
  }

};

module.exports = { PokeAPI };