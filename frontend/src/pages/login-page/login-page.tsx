import "./login-page.css";

import { Form } from "react-router-dom";

export default function LoginPage() {
  return <>
    <main className="signin">
      <h1 className="signin-title">Beware!</h1>

      <p className="signin-preview">You're entering a dangerous zone populated by geese possibly infected with G-42 virus. Your mission will be to locate those geese and tap them as fast as possible to prevent them from spreading the virus. Whoever tapped the most will be rewarded.</p>

      <Form className="signin-form" method="POST">
        <fieldset className="signin-fieldset">
          <label>Login:</label>
          <input type="text" name="login" required className="signin-form-field" placeholder="%username%" autoCapitalize="off" autoComplete="off" autoCorrect="off" autoFocus={true} />
        </fieldset>

        <fieldset className="signin-fieldset">
          <label>Password:</label>
          <input type="password" name="password" required className="signin-form-field" />
        </fieldset>

        <button type="submit" name="signin" value="correctomundo">Sign in</button>
      </Form>
    </main>
  </>;
}
