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

class SpaceAuth extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <form action="/auth" method="post" class="login-form">
        <span class="error">Message</span>
        <input type="text" name="username" placeholder="Username">
        <input class="register" name="email" type="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <a class="login" id="goto-register" href="#">Register</a>
        <a class="register" id="goto-login" href="#">Login</a>
        <button class="login" type="submit">Login</button>
        <button class="register" type="submit">Register</button>
      </form>
    `;
    
    const registerLink = this.querySelector('#goto-register');
    const loginLink = this.querySelector('#goto-login');
    registerLink.addEventListener('click', this.handleRegister.bind(this));
    loginLink.addEventListener('click', this.handleLogin.bind(this));
  }

  handleRegister() {
    const authForm = this.querySelector('form');
    authForm.setAttribute('action', '/register');
    authForm.className = 'register-form';
  }

  handleLogin() {
    const authForm = this.querySelector('form');
    authForm.setAttribute('action', '/auth');
    authForm.className = 'login-form';
  }

  handleSubmit() {
    const authForm = this.querySelector('form');
  
    const formData = new FormData(authForm);
    const url = authForm.getAttribute('action');
    const method = authForm.getAttribute('method');
  
    fetch(url, {
      method: method,
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Réponse du serveur :', data);
      // Fais quelque chose avec la réponse du serveur ici
    })
    .catch(error => {
      console.error('Erreur lors de la requête :', error);
      // Gère les erreurs ici
    });
  }  
}

customElements.define('space-header', SpaceHeader);
customElements.define('space-useritem', SpaceUserItem);
customElements.define('space-message', SpaceMessage);
customElements.define('space-input', SpaceInput);
customElements.define('space-auth', SpaceAuth);