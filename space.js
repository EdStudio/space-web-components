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
    const authForm = this.querySelector('form');
    authForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    const error_dom = this.querySelector('.error');
    error_dom.innerHTML = "";
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

  handleFormSubmit(event) {
    event.preventDefault();
    this.handleSubmit();
  }

  successLogin(result) {
    // Faire quelque chose avec le résultat
    console.log('Fonction appelée avec succès. Résultat : ', result);
    // Ajoute ici le code que tu veux exécuter lorsque la réponse a un code 200
  }

  handleSubmit() {
    const authForm = this.querySelector('form');
    const formData = new FormData(authForm);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const error_dom = this.querySelector('.error');
    error_dom.innerHTML = "";

    const username = formData.get('username');
    const password = formData.get('password');

    if (!username) {
      error_dom.innerHTML = "Username is required";
      return;
    }
    
    if (!password) {
      error_dom.innerHTML = "Password is required";
      return;
    }

    const raw = JSON.stringify({
      "username": formData.get('username'),
      "password": formData.get('password')
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/auth", requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then(result => {
        if (typeof result === 'object') {
          this.successLogin(result);
        } else {
          error_dom.innerHTML = result;
        }
      })
      .catch(error => {
        console.log('error', error);
        error_dom.innerHTML = error;
      });
  }
}

customElements.define('space-header', SpaceHeader);
customElements.define('space-useritem', SpaceUserItem);
customElements.define('space-message', SpaceMessage);
customElements.define('space-input', SpaceInput);
customElements.define('space-auth', SpaceAuth);