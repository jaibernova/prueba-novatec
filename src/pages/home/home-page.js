import { html, LitElement, css } from 'lit';
import { PageController } from '@open-cells/page-controller';
import '../ui/pokemon-detail.js';
import '../ui/pokemon-edit.js';
import '../ui/pokemon-list.js';
import { PokemonDataManager } from '../dm/pokemon-data-manager.js';

class HomePage extends LitElement {

  // Define las propiedades observables del componente.
  static get properties() {
    return {
      pokemons: { type: Array },          // Arreglo que almacenará los Pokémon.
      selectedPokemon: { type: Object },  // Objeto que representa el Pokémon seleccionado.
      showDetail: { type: Boolean },      // Booleano para mostrar el detalle de un Pokémon.
      editMode: { type: Boolean },        // Booleano para activar el modo de edición.
      currentPage: { type: Number },      // Página actual.
      totalPages: { type: Number }        // Total de páginas.
    };
  }

  // Constructor que inicializa las propiedades y crea instancias necesarias.
  constructor() {
    super();
    this.pageController = new PageController(this);   // Instancia de PageController.
    this.pokemons = [];                               // Inicializa el array de Pokémon.
    this.selectedPokemon = null;                      // No hay Pokémon seleccionado al inicio.
    this.showDetail = false;                          // No se muestra el detalle al inicio.
    this.editMode = false;                            // Modo de edición desactivado al inicio.
    this.dataManager = new PokemonDataManager();      // Instancia de PokemonDataManager.
    this.currentPage = 1;                             // Página inicial.
    this.totalPages = 20;                             // Total de páginas inicial.

    // Suscribirse al evento 'pokemons-loaded' usando el PageController.
    this.pageController.subscribe('pokemons-loaded', this.handlePokemonsLoaded.bind(this));
  }

  // Estilos del componente utilizando CSS.
  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      font-family: Arial, sans-serif;
    }

    .pagination button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      margin: 0 10px;
      cursor: pointer;
      border-radius: 5px;
      font-size: 1em;
      transition: background-color 0.3s ease;
    }

    .pagination button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .pagination button:not(:disabled):hover {
      background-color: #0056b3;
    }

    .pagination span {
      font-size: 1em;
      color: #333;
      margin: 0 10px;
    }
  `;

  // Método llamado cuando el componente es agregado al DOM.
  connectedCallback() {
    super.connectedCallback();
    // Llama al método para obtener los Pokémon.
    this.fetchPokemons();
  }

  // Método para obtener los Pokémon a través del data manager.
  fetchPokemons() {
    this.dataManager.fetchPokemons(this.currentPage);
  }

  // Maneja el evento 'pokemons-loaded' y actualiza la propiedad pokemons.
  handlePokemonsLoaded(eventDetail) {
    this.pokemons = eventDetail.pokemons; // Asigna los Pokémon cargados a la propiedad.
    this.requestUpdate(); // Solicita una actualización del componente.
  }

  // Maneja la selección de un Pokémon de la lista.
  handleSelect(e) {
    this.selectedPokemon = e.detail; // Asigna el Pokémon seleccionado.
    this.showDetail = true; // Muestra el detalle del Pokémon seleccionado.
  }

  // Muestra la lista de Pokémon, ocultando el detalle.
  showList() {
    this.showDetail = false; // Oculta el detalle.
    this.selectedPokemon = null; // Desselecciona el Pokémon.
  }

  // Activa el modo de edición para el Pokémon seleccionado.
  editPokemon() {
    this.editMode = true; // Activa el modo de edición.
  }

  // Cierra el modo de edición.
  closeEdit() {
    this.editMode = false; // Desactiva el modo de edición.
  }

  // Cambia la página y solicita la lista de Pokémon actualizada.
  changePage(page) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPokemons();
    }
  }

  // Renderiza el contenido del componente basado en su estado actual.
  render() {
    return html`
      ${this.editMode
        ? html`<pokemon-edit .pokemon="${this.selectedPokemon}" @close-edit="${this.closeEdit}"></pokemon-edit>`
        : this.showDetail
          ? html`<pokemon-detail .pokemon="${this.selectedPokemon}" @back="${this.showList}" @edit="${this.editPokemon}"></pokemon-detail>`
          : html`
              <pokemon-list .pokemons="${this.pokemons}" @select="${this.handleSelect}"></pokemon-list>
              <div class="pagination">
                <button @click="${() => this.changePage(this.currentPage - 1)}" ?disabled="${this.currentPage === 1}">Anterior</button>
                <span>Página ${this.currentPage} de ${this.totalPages}</span>
                <button @click="${() => this.changePage(this.currentPage + 1)}" ?disabled="${this.currentPage === this.totalPages}">Siguiente</button>
              </div>
            `
      }
    `;
  }
}

customElements.define('home-page', HomePage);
