import { LitElement } from 'lit';
import { PageController } from '@open-cells/page-controller';

export class PokemonDataManager extends LitElement {

  static get properties() {
    return {
      pokemons: { type: Array },
    };
  }

  constructor() {
    super();
    this.pageController = new PageController(this);
  }

  // Metodo asíncrono que se encarga de obtener la información de los pokemon
  async fetchPokemons(page) {
    try {
      // Realiza una solicitud a la API de Pokemon para obtener un listado de pokemons
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${page}`);
      const data = await response.json();

      // Mapea los resultados para obtener la información detallada de cada pokemon.
      const pokemonPromises = data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        return await pokemonResponse.json();
      });

      // Espera a que se resuelvan todas las promesas y asigna los resultados al array 'pokemons'.
      this.pokemons = await Promise.all(pokemonPromises);

      // Publica el evento 'pokemons-loaded' usando el PageController
      this.pageController.publish('pokemons-loaded', { pokemons: this.pokemons });

    } catch (error) {
      console.error('Error:', error);
    }
  }
}

customElements.define('pokemon-data-manager', PokemonDataManager);
