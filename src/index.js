import { h } from 'hyperapp'
import $form from './form'

const auth = firebase.auth()

const $identity = (s,a) => $form({
  key: 'identity-form',
  titleText: 'Identity Required',
  promptText: `New and existing users please enter your email address to continue`,
  submitText: 'Continue',
  errorText: s.firebaseAuth.error.message,
  inputs: [{
    name: 'email', type: 'email', placeholder: 'Email Address', autocomplete: 'email'
  }],
  action: a.firebaseAuth.fetchProviders,
})

const $signin = (s,a) => $form({
  key: 'signin-form',
  titleText: 'Existing Identity',
  promptText: 'In order for us to confirm your identity please enter your password.',
  submitText: 'Sign In',
  errorText: s.firebaseAuth.error.message,
  inputs: [
    { name: 'password', type: 'password', placeholder: 'Password' },
    { name: 'email', type: 'hidden', value: s.firebaseAuth.user.email },
  ],
  action: a.firebaseAuth.signin,
  links: [
    { text: 'Sign in with a different identity', action: a.firebaseAuth.resetIdentity },
    { text: 'Reset password', action: a.firebaseAuth.resetPassword },
  ],
})

const $signup = (s,a) => $form({
  key: 'signup-form',
  titleText: 'New Identity',
  promptText: 'Please confirm your email address and a set a secure password.',
  submitText: 'Create User',
  errorText: s.firebaseAuth.error.message,
  inputs: [
    { name: 'email', type: 'email', value: s.firebaseAuth.user.email },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ],
  action: a.firebaseAuth.signup,
  links: [
    { text: 'Sign in with a different identity', action: a.firebaseAuth.resetIdentity }
  ],
})

const $auth = (s,a) =>
  h('dialog', {}, [
    !s.firebaseAuth.user.email
      ? $identity(s,a)
      : s.firebaseAuth.hasIdentity.length ? $signin(s,a) : $signup(s,a),
  ])

export const firebaseAuth = _ => ({
  state: {
    firebaseAuth: {
      authed: false,
      checked: false,
      user: {},
      error: {},
      hasIdentity: [],
    }
  },
  actions: {
    firebaseAuth: {
      setHasIdentity: (s,a,hasIdentity) => ({ firebaseAuth: Object.assign({}, s.firebaseAuth, { hasIdentity }) }),
      setUser: (s,a,user) => ({ firebaseAuth: Object.assign({}, s.firebaseAuth, { user }) }),
      setError: (s,a,error) => ({ firebaseAuth: Object.assign({}, s.firebaseAuth, { error }) }),
      signout: _ => _ => auth.signOut(),
      signin: (s,a,{email,password}) => {
        a.firebaseAuth.setError({})
        auth.signInWithEmailAndPassword(email, password)
          .catch(a.firebaseAuth.setError)
      },
      signup: (s,a,{email,password}) => {
        a.firebaseAuth.setError({})
        a.firebaseAuth.setUser({ email })
        auth.createUserWithEmailAndPassword(email, password)
          .catch(a.firebaseAuth.setError)
      },
      fetchProviders: (s,a,{email}) => {
        a.firebaseAuth.setError({})
        auth.fetchProvidersForEmail(email)
          .then(providers => {
            a.firebaseAuth.setUser({ email })
            a.firebaseAuth.setHasIdentity(providers)
          }).catch(a.firebaseAuth.setError)
      },
      userChanged: (s,a,user) => update => update({
        firebaseAuth: Object.assign({}, s.firebaseAuth, {
          user: user || {},
          authed: !!user,
          checked: true,
        })
      }),
      resetPassword: (s,a,d) => _ =>
        confirm(`Send a password reset email to ${s.firebaseAuth.user.email}?`) &&
        auth.sendPasswordResetEmail(s.firebaseAuth.user.email).then(_ =>
          alert(`A password reset email has been sent to ${s.firebaseAuth.user.email} please check your inbox.`)
        ).catch(a.setError),
      resetIdentity: s => ({
        firebaseAuth: Object.assign({}, s.firebaseAuth, {
          user: {},
          error: {}
        })
      }),
    }
  },
  events: {
    load: (s,a) => auth.onAuthStateChanged(a.firebaseAuth.userChanged),
    render: (s,a,v) => {
      if(!s.firebaseAuth.checked) return () => h('auth-check')
      if(!s.firebaseAuth.authed && v(s,a).data.auth) return $auth
    }
  },
})
