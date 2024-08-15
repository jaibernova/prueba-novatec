import { LitElement, html, css } from 'lit';

class PokemonList extends LitElement {

  static properties = {
    pokemons: { type: Array }, // Array que contiene la lista de Pokémon.
    filteredPokemons: { type: Array }, // Array que contiene la lista filtrada de Pokémon.
    types: { type: Array }, // Array que contiene los tipos de Pokémon.
    selectedType: { type: String } // Tipo seleccionado para el filtrado.
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .type-filter {
      margin-bottom: 16px;
      display: flex;
      justify-content: center;
    }

    .type-filter select {
      padding: 8px;
      font-size: 16px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    .header {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }

    .header img {
      max-width: 100%;
      height: auto;
    }

    .pokemon-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .pokemon {
      cursor: pointer;
      padding: 16px;
      border-radius: 8px;
      background-color: #f5f5f5;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      transition: transform 0.2s ease-in-out;
    }

    .pokemon:hover {
      transform: translateY(-5px); 
    }

    .pokemon img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-right: 16px;
    }

    .pokemon-details {
      flex: 1;
    }

    .pokemon-name {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .pokemon-type {
      font-size: 14px;
      color: #666;
    }


  `;

  constructor() {
    super();
    this.pokemons = [];
    this.filteredPokemons = [];
    this.types = [];
    this.selectedType = 'all'; // Valor por defecto que muestra todos los Pokémon.
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchPokemonTypes();
  }

  fetchPokemonTypes() {
    // Obtener todos los tipos de Pokémon presentes en la lista de Pokémon.
    const typesSet = new Set();
    this.pokemons.forEach(pokemon => {
      pokemon.types.forEach(typeInfo => typesSet.add(typeInfo.type.name));
    });
    this.types = Array.from(typesSet); // Convertir el Set a Array.
    console.log(this.types)
  }

  updated(changedProperties) {
    if (changedProperties.has('pokemons') || changedProperties.has('selectedType')) {
      this.filterPokemons();
    }
  }

  filterPokemons() {
    this.fetchPokemonTypes();
    if (this.selectedType === 'all') {
      this.filteredPokemons = [...this.pokemons]; // Mostrar todos los Pokémon.
    } else {
      this.filteredPokemons = this.pokemons.filter(pokemon =>
        pokemon.types.some(typeInfo => typeInfo.type.name === this.selectedType)
      );
    }
  }

  handleTypeChange(event) {
    this.selectedType = event.target.value; // Actualizar el tipo seleccionado.
  }

  render() {
    return html`
      <div class="header">
        <img src="../../src/resources/pokemon-logo.png" alt="Pokedex"> <!-- Imagen del encabezado con el logo de Pokémon -->
      </div>

      <!-- Filtro de tipo -->
      <div class="type-filter">
        <select @change="${this.handleTypeChange}">
          <option value="all">Tipos</option>
          ${this.types.map(type => html`
            <option value="${type}">${type}</option>
          `)}
        </select>
      </div>

      <!-- Lista filtrada de Pokémon -->
      <div class="pokemon-list">
        ${this.filteredPokemons.map(pokemon => html`
          <div class="pokemon" @click="${() => this.selectPokemon(pokemon)}">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"> <!-- Imagen del Pokémon -->
            <div class="pokemon-details">
              <p class="pokemon-name">${pokemon.name}</p> <!-- Nombre del Pokémon -->
              <p class="pokemon-type">Tipo: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p> <!-- Tipo(s) del Pokémon -->
            </div>
          </div>
        `)}
      </div>
    `;
  }

  selectPokemon(pokemon) {
    this.dispatchEvent(new CustomEvent('select', { detail: pokemon })); 
  }
}

customElements.define('pokemon-list', PokemonList);
