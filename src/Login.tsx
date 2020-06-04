import React, {FunctionComponent, useState, FormEvent} from 'react';
import client from './feathers';

export type LoginProps = {
  activeUsers: number;
};

const Login: FunctionComponent<LoginProps> = ({activeUsers}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = async (ev?: FormEvent) => {
    ev && ev.preventDefault();
    setErrorMessage('');
    try {
      await client.authenticate({
        strategy: 'local',
        email, password
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  const signup = async () => {
    try {
      await client.service('users').create({ email, password })
      await login();
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <main className="login container">
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet text-center heading">
          <h1 className="font-100">Log in or signup</h1>
          <div>
              There {activeUsers === 1 ? 'is ' : 'are '} 
              {activeUsers > 0 ? activeUsers : 'no '} active {activeUsers === 1 ? 'user' : 'users'} signed in.
          </div>
          <p>{errorMessage}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form className="form" onSubmit={login}>
            <fieldset>
              <input className="block" type="email" name="email" placeholder="email" 
              onChange={ev => setEmail(ev.target.value)} />
            </fieldset>

            <fieldset>
              <input className="block" type="password" name="password" placeholder="password"
              onChange={ev => setPassword(ev.target.value)} />
            </fieldset>

            <button type="submit" className="button button-primary block signup" onClick={login}>
              Log in
            </button>

            <button type="button" className="button button-primary block signup" onClick={signup}>
              Signup
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
