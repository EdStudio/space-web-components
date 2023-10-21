class SpaceHeader extends HTMLElement {
  constructor() {
    super();
    this.name = this.getAttribute('name');
  }

  connectedCallback() {
    this.innerHTML = this.name;
  }

  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
    this.connectedCallback();
  }
}

class SpaceUserItem extends HTMLElement {
  constructor() {
    super();
    this.name = this.getAttribute('name');
  }
  
  connectedCallback() {
    this.innerHTML = this.name;
  }
}

class SpaceMessage extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.encrypt = this.getAttribute('encrypt');
    this.timestamp = this.getAttribute('timestamp');
    this.name = this.getAttribute('name');
    this.text = this.getAttribute('text');

    const encrypt_emoji = {
      'false': '⚪',
      'true': '🔵'
    }

    this.innerHTML = `
        <span class="up">
          <span class="encrypt">${encrypt_emoji[this.encrypt]}</span>
          <span class="name">${this.name}</span>
          <span class="date">${this.timestamp}</span>
        </span>
        <span class="down">${this.text}</span>
    `;
  }
}

class SpaceInput extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.innerHTML = `
      <input type="text" placeholder="Message">
      <span class="material-symbols-rounded">send</span>
    `;
  }
}

class SpaceForm extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    const attributes = this.attributes;
  
    for (const attribute of attributes) {
      console.log(`Nom de l'attribut : ${attribute.name}, Valeur de l'attribut : ${attribute.value}`);
      const input = document.createElement('input');
      input.setAttribute('type', attribute.name);
      input.setAttribute('placeholder', attribute.name);
      this.appendChild(input);
    }
    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.innerHTML = 'Submit';
    this.appendChild(button);
  }
}

customElements.define('space-header', SpaceHeader);
customElements.define('space-useritem', SpaceUserItem);
customElements.define('space-message', SpaceMessage);
customElements.define('space-input', SpaceInput);
customElements.define('space-form', SpaceForm);