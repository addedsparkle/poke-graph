# poke-graph
Example GraphQL server implementation using the open PokeAPI

## How to use this 

The main branch will contain the finished implementation but you can step through the stages using the following branches

 Branch | Description 
--------| ------------
main | full server and schema
get-started | The original Apollo Server implementation from the Getting Started documents with basic Book schema and hard coded data
my-first-pokemon | Schema now features a basic pokemon type and fetches data from the PokeApi
hawlucha | Can now get a Pokemon by name
pokemon-type | get the type of the pokemon using resolver
double-damage | add the damage relations for the pokemon's type using a further REST call to discover which types cause double damage
nPlusOne | add the pokemon in the double damage types and fetch their sprites
restdatasource | Switches to using RESTDataSource for the PokeApi
mutation | Adds a mutation to allow adding pokemon to a trainer