class TrainerAPI {
    
    constructor() {
        this.trainerInfo = { 'jennifer' : {
            name: 'jennifer',
            pokemon: [{ name:'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4'}]
        }}
    }

    getTrainer(name) {
        return this.trainerInfo[name];
    }

    addPokemon(name, pokemon) {
        if (!this.trainerInfo[name]){
            return {success: false, trainer: null};
        }
        this.trainerInfo[name].pokemon.push(...pokemon);
        return {success: true, trainer: this.trainerInfo[name]}
    }
}

module.exports = { TrainerAPI };