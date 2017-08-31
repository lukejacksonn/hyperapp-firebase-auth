# Fauth

> A drop in authentication solution for hyperapps

This project exports a hyperapp mixin that wraps the Firebase authentication API. It manages the application state and renders appropriate views for the authentication flows `Sign In` and `Sign Up`. Out of the box features include:

- New user detection
- Human readable error messages
- Email validation and confirmation
- Reset password by email
- Compatible with @hyperapp/router
- No backend code!

## Setup

If you want to utilize Firebase Authentication for your own apps then you will need to create a Firebase Account and create a new project. This can be done for **free** at https://console.firebase.google.com (if you don't want to create your own project and just want to try the mixin out then you can use the example config below). Once you have created a project you will be presented with your application's configuration which will look something like this:

```
<script src="https://www.gstatic.com/firebasejs/4.3.0/firebase.js"></script>
<script>
  // Initialize Firebase
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

Add this snippet to your `index.html` **before** your hyperapp application code. This ensures that the Firebase API exists when the mixin loads. It is possible to `require` or `import` the Firebase library into your project, but the setup for this is out of the scope of this example.

Once you are setup, visit the link below (replacing `${projectId}` with the projectId from your newly created Firebase project config) and `Enable` the `Email/Password` provider.

```
https://console.firebase.google.com/project/${projectId}/authentication/providers
```

That is all the back and front end configuration you need to do.. Phew :sweat_smile:


## Usage

Assuming you now have a Firebase project and have configured it on the frontend; then all that is left to do is to list `fauth` in your hyperapp mixins.

```
import { app, h } from 'hyperapp'
import fauth from 'hyperapp-fauth'

app({
  state: {},
  view: state =>
    h('main', { auth: true }, `Hello ${state.fauth.user.uid}!`),
  mixins: [fauth]
})
```

When you app loads the mixin will get to work:

- The mixin will check the view root for the prop `{ auth: true }`
- If the view requires auth then the mixin prevents the view from rendering
- An empty element is rendered until an auth status is received from Firebase
- If the auth status is null then all users are prompted to enter their email address
  - Existing users are then prompted to enter their password to sign in
  - New users are prompted to confirm their email address and set a password to sign up
- The root view will be rendered once auth status returns a valid Firebase user
