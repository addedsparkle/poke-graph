class TrainerAPI {
    
    constructor() {
        this.trainerInfo = { 'jennifer' : {
            name: 'jennifer',
            pokemon: [{ name:'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4'}]
        }}
    }

    getTrainer(name) {
        console.log(this.trainerInfo[name]);
        return this.trainerInfo[name];
    }

    addPokemon(name, pokemon) {
        if (!this.trainerInfo[name]){
            return {success: false, trainer: null};
        }
        console.log(this.trainerInfo[name]);
        this.trainerInfo[name].pokemon.push(...pokemon);
        console.log(this.trainerInfo[name]);
        return {success: true, trainer: this.trainerInfo[name]}
    }
}

module.exports = { TrainerAPI };