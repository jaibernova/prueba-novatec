import { LitElement, html, css } from 'lit';
import { PokemonEvolutionsDataManager } from '../dm/pokemon-evolutions-data-manager.js';
import { PageTransitionsMixin } from '@open-cells/page-transitions';
import { PageController } from '@open-cells/page-controller';

class PokemonDetail extends PageTransitionsMixin(LitElement) {

  // Define las propiedades observables del componente.
  static properties = {
    pokemon: { type: Object }, // Objeto que representa el Pokémon cuyo detalle se mostrará.
  };

  // Estilos del componente utilizando CSS.
  static styles = css`
        :host {
      display: block;
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 16px;
      color: #333;
    }

    .pokemon-details {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .pokemon-img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-right: 24px;
    }

    .pokemon-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .pokemon-type {
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
    }

    .pokemon-type-title {
      font-weight: bold;
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
    }

    .evolutions {
      margin-top: 24px;
    }

    .evolution {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }

    .evolution img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 16px;
    }

    .evolution-name {
      font-size: 16px;
      font-weight: bold;
    }

    .buttons {
      margin-top: 16px;
    }

    button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 8px;
    }

    button:hover {
      background-color: #0056b3;
    }
  `;

  // Constructor que inicializa las propiedades y crea instancias necesarias.
  constructor() {
    super();
    this.dataManager = new PokemonEvolutionsDataManager(); // Instancia de PokemonEvolutionsDataManager.
    this.evolutions = []; // Inicializa el array de evoluciones.
    this.pageController = new PageController(this);

    // Suscribirse a los eventos publicados 
    this.pageController.subscribe('pokemon-evolutions-fetched', (evolutions) => this.onEvolutionsFetched(evolutions));
    this.pageController.subscribe('pokemon-evolutions-error', (error) => this.onEvolutionsError(error));

    this.pageTransitionType = 'verticalUp';
  }

  // Método llamado cuando se actualizan las propiedades observables.
  async updated(changedProperties) {
    if (changedProperties.has('pokemon') && this.pokemon) {
      await this.loadEvolutions(); // Carga las evoluciones si se ha actualizado la propiedad 'pokemon'.
    }
  }

  // Método asíncrono para cargar las evoluciones del Pokémon.
  async loadEvolutions() {
    try {
      if (!this.pokemon || !this.pokemon.name) {
        return; // No hace nada si no hay un Pokémon o si su nombre no está definido.
      }

      // Llama al método de carga de evoluciones en el data manager.
      await this.dataManager.fetchPokemonEvolutions(this.pokemon.name);
    } catch (error) {
      console.error('Error:', error); // Muestra un error en la consola si ocurre.
    }
  }

  // Método llamado cuando se reciben las evoluciones con éxito.
  onEvolutionsFetched(evolutions) {
    this.evolutions = evolutions;
    this.requestUpdate(); // Solicita una actualización del componente.
  }

  // Método llamado cuando ocurre un error al obtener las evoluciones.
  onEvolutionsError(error) {
    console.error('Error', error);
  }

  // Método para renderizar el contenido del componente.
  render() {
    if (!this.pokemon) {
      return html`<p>Cargando...</p>`; // Muestra un mensaje de carga si no hay información del Pokémon.
    }

    return html`
      <div class="pokemon-details">
        <img class="pokemon-img" src="${this.pokemon.sprites.front_default}" alt="${this.pokemon.name}">
        <div>
          <h1>${this.pokemon.name}</h1>
          <p class="pokemon-type">Tipo: ${this.pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
          <p class="pokemon-type">Habilidades: ${this.pokemon.abilities.map(typeInfo => typeInfo.ability.name).join(', ')}</p>
          <p class="pokemon-type-title">Estadísticas</p>
          <p class="pokemon-type"> ${this.pokemon.stats.map(typeInfo => `${typeInfo.stat.name}: ${typeInfo.base_stat}`).join(', ')}</p>
        </div>
      </div>

      <div class="buttons">
        <button @click="${this.back}">Volver</button>
        <button @click="${this.edit}">Editar</button>
      </div>

      <h2>Evoluciones</h2>
      <div class="evolutions">
        ${this.evolutions.length > 0 ? this.renderEvolutions(this.evolutions) : html`<p>No se encontraron evoluciones.</p>`}
      </div>
    `;
  }

  // Método para renderizar la lista de evoluciones.
  renderEvolutions(evolutions) {
    return html`
      ${evolutions.map(evolution => html`
        <div class="evolution">
          <img src="${evolution.image}" alt="${evolution.name}">
          <p class="evolution-name">${evolution.name}</p>
        </div>
      `)}
    `;
  }

  // Método para manejar el evento de volver a la vista anterior.
  back() {
    this.dispatchEvent(new CustomEvent('back')); 
  }

  // Método para manejar el evento de edición del Pokémon.
  edit() {
    this.dispatchEvent(new CustomEvent('edit')); 
  }
}

customElements.define('pokemon-detail', PokemonDetail);
