const { TrainerAPI } = require('./trainerApi');

describe('The TrainerAPI', () => {

    let trainerApi;

    beforeEach(() => {
        trainerApi = new TrainerAPI();
    })

    it(' should create Jennifer as a default', () => {
        expect(trainerApi.getTrainer('jennifer')).toEqual({name: 'jennifer', pokemon: [{ name:'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25'}]});
    });

    it('should add more pokemon to a user entry', () => {
        const response = trainerApi.addPokemon('jennifer', [
            {name: 'hawlucha', url: 'https://pokeapi.co/api/v2/pokemon/701'}, 
            {name: 'ditto', url: 'https://pokeapi.co/api/v2/pokemon/132'}
        ]);
            
        expect(response).toEqual({
            success: true,
            trainer: {
                name: 'jennifer',
                pokemon: [
                    { 
                        name:'pikachu', 
                        url: 'https://pokeapi.co/api/v2/pokemon/25'
                    },
                    {
                        name: 'hawlucha', 
                        url: 'https://pokeapi.co/api/v2/pokemon/701'
                    },
                    {
                        name: 'ditto',
                        url: 'https://pokeapi.co/api/v2/pokemon/132'
                    }
                ]
            }
        })
    });

    it('should return false if user does not exist', () => {
        const response = trainerApi.addPokemon('bobby', [
            {name: 'hawlucha', url: 'https://pokeapi.co/api/v2/pokemon/701'}, 
            {name: 'ditto', url: 'https://pokeapi.co/api/v2/pokemon/132'}
        ]);
            
        expect(response).toEqual({
            success: false,
            trainer: null
        })
    });
});