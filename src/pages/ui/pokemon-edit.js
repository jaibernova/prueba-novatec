import { LitElement, html, css } from 'lit';


class PokemonEdit extends LitElement {

  // Define las propiedades observables del componente.
  static properties = {
    pokemon: { type: Object } // Objeto que representa el Pokémon a editar.
  };

  //  estilos del componente utilizando CSS.
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
    }

    .form-group input[type="text"], .form-group input[type="checkbox"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 14px;
    }

    .evolution-group {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 16px;
    }

    button.close-button {
      background-color: #dc3545;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    button.close-button:hover {
      background-color: #c82333;
    }
  `;

  // Renderiza el contenido del componente.
  render() {
    return html`
      <button class="close-button" @click="${this.close}">Cerrar</button>
      <h1>Editar ${this.pokemon.name}</h1>

      <div class="form-group">
        <label for="name">Nombre</label>
        <input id="name" type="text" .value="${this.pokemon.name}">
      </div>

      <div class="form-group">
        <label for="type">Tipo</label>
        <input id="type" type="text" .value="${this.pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}">
      </div>

      <div class="form-group">
        <label for="image">Imagen</label>
        <input id="image" type="text" .value="${this.pokemon.sprites.front_default}">
      </div>

      ${this.renderEvolutions()} <!-- Llama al método para renderizar las evoluciones del Pokémon -->


    `;
  }

  // Renderiza el grupo de entradas para las evoluciones del Pokémon.
  renderEvolutions() {
    if (!this.pokemon.evolutions || this.pokemon.evolutions.length === 0) {
      return html`<p></p>`; // Retorna un párrafo vacío si no hay evoluciones.
    }

    // Mapea y renderiza cada evolución del Pokémon.
    return this.pokemon.evolutions.map((evolution, index) => html`
      <div class="evolution-group">
        <div class="form-group">
          <label for="evo-name-${index}">Name</label>
          <input id="evo-name-${index}" type="text" .value="${evolution.name}">
        </div>

        <div class="form-group">
          <label for="evo-type-${index}">Type</label>
          <input id="evo-type-${index}" type="text" .value="${evolution.type}">
        </div>

        <div class="form-group">
          <label for="evo-image-${index}">Image</label>
          <input id="evo-image-${index}" type="text" .value="${evolution.image}">
        </div>
      </div>
    `);
  }

  // Maneja el evento de cierre del formulario de edición.
  close() {
    this.dispatchEvent(new CustomEvent('close-edit')); 
  }


}


customElements.define('pokemon-edit', PokemonEdit);
