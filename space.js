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
    console.log(result);
    const userid = result.auth.id;
    const username = result.auth.username;
    const email = result.auth.email;
    if (!userid || !username || !email) {
      console.error('Invalid user data', result);
      return;
    }
    sessionStorage.setItem('userid', userid);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('email', email);
    this.remove();
    //users.download();
    const spaceUserList = document.createElement('space-userlist');
    document.querySelector('space-list').appendChild(spaceUserList);
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
      credentials: 'include',
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
          try {
            error_dom.innerHTML = JSON.parse(result).error;
          }
          catch (e) {
            error_dom.innerHTML = result;
          }
        }
      })
      .catch(error => {
        console.log('error', error);
        error_dom.innerHTML = error;
      });
  }
}

class SpaceUserlist extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const data = await users.getAll();
    for (const user of data) {
      this.innerHTML += `<space-useritem name="${user.username}"></space-useritem>`;
    }
  }
}

class Users {
  constructor() {
    this.users = [];
  }

  add(user) {
    this.users.push(user);
  }

  getByUsername(username) {
    for (const user of this.users) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  getById(id) {
    for (const user of this.users) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  async getAll() {
    if (this.users.length === 0) {
      await this.download();
    }
    return this.users;
  }

  successDownload(result) {
    for (const user of result.users) {
      this.add(new User(user.id, user.username, user.public_key, user.email, user.private_key));
    }
  }

  async download() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      credentials: 'include',
      redirect: 'follow'
    };

    await fetch("http://localhost:3000/profiles", requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then(result => {
        if (typeof result === 'object') {
          this.successDownload(result);
        } else {
          console.log(result);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }
}

const users = new Users();

class User {
  constructor(id, username, publicKey = null, email = null, privateKey = null) {
    this.id = id;
    this.username = username;
    this.publicKey = publicKey;
    this.email = email;
    this.privateKey = privateKey;
  }
}

class Messages {
  constructor() {
    this.messages = [];
  }
  
  add(message) {
    this.messages.push(message);
  }
  
  get(id) {
    return this.messages.find(message => message.id === id);
  }
  
  remove(id) {
    this.messages = this.messages.filter(message => message.id !== id);
  }
  
  getAll() {
    return this.messages;
  }
}

const messages = new Messages();

class Message {
  constructor(id, fromUserId, toUserId, message, isRead, createdAt, isEncrypted) {
    this.id = id;
    this.fromUserId = fromUserId;
    this.toUserId = toUserId;
    this.message = message;
    this.isRead = isRead;
    this.createdAt = createdAt;
    this.isEncrypted = isEncrypted;
  }  
}



customElements.define('space-header', SpaceHeader);
customElements.define('space-useritem', SpaceUserItem);
customElements.define('space-message', SpaceMessage);
customElements.define('space-input', SpaceInput);
customElements.define('space-auth', SpaceAuth);
customElements.define('space-userlist', SpaceUserlist);