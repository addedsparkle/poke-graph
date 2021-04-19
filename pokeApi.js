const { RESTDataSource } = require("apollo-datasource-rest");

const prefixUrl = "https://pokeapi.co/api/v2";

class PokeAPI extends RESTDataSource {

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