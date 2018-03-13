# hyperapp-firebase-auth

> Drop in firebase authentication for hyperapps

![ezgif com-gif-maker](https://user-images.githubusercontent.com/1457604/29901861-6cf8c5d4-8df2-11e7-9611-e2800e7bde96.gif)

This project exports a [hyperapp](https://github.com/hyperapp/hyperapp) module (state/actions/view) that wraps the [Firebase authentication API](https://firebase.google.com/docs/auth/). It manages the application state and renders appropriate views for the authentication flows `Sign In` and `Create User`.

**DEMO:** https://codepen.io/lukejacksonn/pen/xLBJoN

Out of the box features include:

- No server setup or backend code
- Human readable error messages
- Email validation and confirmation
- Reset password by email

## Usage

> If you have not already initialized firebase on your frontend see [Firebase Setup](#firebase-setup)

Install the package from npm or include from [CDN](https://unpkg.com/hyperapp-firebase-auth):

```
npm i hyperapp-firebase-auth
```

Import the module `firebaseAuth` and the `FirebaseAuthDialog` view:

```js
import { app, h } from 'hyperapp'
import { firebaseAuth, FirebaseAuthDialog } from 'hyperapp-firebase-auth'

const main =
  app(
    { auth: firebaseAuth.state },
    { auth: firebaseAuth.actions },
    (state, actions) =>
      h('main', {}, [
        // Only shows when NOT authenticated
        FirebaseAuthDialog(state.auth, actions.auth),
        // Only shows when authenticated
        state.auth.authed && `Hello ${state.auth.user.uid}!`
      ]),
    document.body
  )

firebase.auth().onAuthStateChanged(main.auth.userChanged)
```


## How it works

- An empty element is rendered until an auth status is received from Firebase
- If the auth status is null then the user is prompted to enter their email address
  - Existing users are then prompted to enter their password to sign in
  - New users are prompted to confirm their email address and set a password to sign up
- The dialog will not be rendered once auth status returns a valid Firebase user


## Firebase Setup

If you want to use Firebase Authentication for your own apps then you will need to create a Firebase Account and create a new project. This can be done for **free** at https://console.firebase.google.com.

> If you don't want to create your own project then you can use the example config below

Once you have created a project you will be presented with an app configuration like this:

```html
<script src="https://www.gstatic.com/firebasejs/4.3.0/firebase.js"></script>
<script>
  var config = {
    apiKey: "AIzaSyBKRtxwj3SrSZdlKs4x5CeFm4zxymv6JDU",
    authDomain: "hyperapp-497ce.firebaseapp.com",
    databaseURL: "https://hyperapp-497ce.firebaseio.com",
    projectId: "hyperapp-497ce",
    storageBucket: "hyperapp-497ce.appspot.com",
    messagingSenderId: "458459404992"
  };
  firebase.initializeApp(config);
</script>
```

Add this snippet to your `index.html` **before** any of your hyperapp application code. This ensures that the Firebase API exists when the module loads. Once you are setup, visit the link below (replacing `${projectId}` with the projectId from your newly created Firebase project config) and `Enable` the `Email/Password` provider.

```
https://console.firebase.google.com/project/${projectId}/authentication/providers
```

That is all the back and front end configuration you need to do.
