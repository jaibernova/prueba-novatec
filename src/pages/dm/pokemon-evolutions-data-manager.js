import { LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';

export class PokemonEvolutionsDataManager extends LitElement {

  constructor() {
    super();
    this.pageController = new PageController(this); // Instancia de PageController.
  }

  // Método asíncrono para obtener las evoluciones de un Pokémon dado su nombre.
  async fetchPokemonEvolutions(pokemonName) {
    try {
      // Realiza una solicitud HTTP para obtener los datos de la especie del Pokémon.
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
      const speciesData = await speciesResponse.json();

      // Obtiene la URL de la cadena de evolución desde los datos de la especie.
      const evolutionChainUrl = speciesData.evolution_chain.url;
      console.log(evolutionChainUrl);
      
      // Realiza una solicitud HTTP para obtener los datos de la cadena de evolución.
      const chainResponse = await fetch(evolutionChainUrl);
      const chainData = await chainResponse.json();

      console.log(chainData);

      // Analiza y obtiene la lista de evoluciones a partir de los datos de la cadena de evolución.
      const evolutions = await this.parseEvolutionChain(chainData);

      // Publica las evoluciones obtenidas utilizando el PageController.
      this.pageController.publish('pokemon-evolutions-fetched', evolutions);

      return evolutions; // Retorna las evoluciones obtenidas.
    } catch (error) {
      // Captura y muestra cualquier error que ocurra durante la obtención de las evoluciones.
      console.error('Error:', error);

      // Publica el error utilizando el PageController.
      this.pageController.publish('pokemon-evolutions-error', error);

      throw error; 
    }
  }

  // Método asíncrono para analizar la cadena de evolución y obtener las evoluciones.
  async parseEvolutionChain(chainData) {
    const evolutions = []; // Inicializa un array para almacenar las evoluciones.

    let currentStep = chainData.chain; // Comienza con el primer eslabón de la cadena de evolución.
    do {
      // Obtiene el ID del Pokémon actual a partir de la URL de su especie.
      const pokemonId = await this.getPokemonId(currentStep.species.url);
      
      // Obtiene los datos del Pokémon actual a partir de su ID.
      const pokemonData = await this.getPokemonData(pokemonId);
      
      // Crea un objeto con el nombre del Pokémon y su imagen.
      const pokemon = {
        name: currentStep.species.name,
        image: pokemonData.sprites.front_default,
      };
      evolutions.push(pokemon); // Agrega el Pokémon actual al array de evoluciones.

      // Avanza al siguiente paso en la cadena de evolución si existe.
      currentStep = currentStep.evolves_to.length > 0 ? currentStep.evolves_to[0] : null;
    } while (currentStep !== null); // Continúa hasta que no haya más evoluciones.
    console.log(evolutions);
    return evolutions; // Retorna el array de evoluciones.
  }

  // Método asíncrono para obtener el ID de un Pokémon a partir de la URL de su especie.
  async getPokemonId(url) {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data.id; // Retorna el ID del Pokémon.
  }

  // Método asíncrono para obtener los datos de un Pokémon a partir de su ID.
  async getPokemonData(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    return await response.json(); // Retorna los datos del Pokémon.
  }
}

customElements.define('pokemon-evolutions-data-manager', PokemonEvolutionsDataManager);
