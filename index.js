import { h } from 'hyperapp'
import $form from './form'

const auth = firebase.auth()

const $identity = (s,a) => $form({
  key: 'identity-form',
  titleText: 'Identity Required',
  promptText: `New and existing users please enter your email address to continue`,
  submitText: 'Continue',
  errorText: s.fauth.error.message,
  inputs: [{
    name: 'email', type: 'email', placeholder: 'Email Address', autocomplete: 'email'
  }],
  action: a.fauth.fetchProviders,
})

const $signin = (s,a) => $form({
  key: 'signin-form',
  titleText: 'Existing Identity',
  promptText: 'In order for us to confirm your identity please enter your password.',
  submitText: 'Sign In',
  errorText: s.fauth.error.message,
  inputs: [
    { name: 'password', type: 'password', placeholder: 'Password' },
    { name: 'email', type: 'hidden', value: s.fauth.user.email },
  ],
  action: a.fauth.signin,
  links: [
    { text: 'Sign in with a different identity', action: a.fauth.resetIdentity },
    { text: 'Reset password', action: a.fauth.resetPassword },
  ],
})

const $signup = (s,a) => $form({
  key: 'signup-form',
  titleText: 'New Identity',
  promptText: 'Please confirm your email address and a set a secure password.',
  submitText: 'Create User',
  errorText: s.fauth.error.message,
  inputs: [
    { name: 'email', type: 'email', value: s.fauth.user.email },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ],
  action: a.fauth.signup,
  links: [
    { text: 'Sign in with a different identity', action: a.fauth.resetIdentity }
  ],
})

const $auth = (s,a) =>
  h('dialog', {}, [
    !s.fauth.user.email
      ? $identity(s,a)
      : s.fauth.hasIdentity.length ? $signin(s,a) : $signup(s,a),
  ])

export default _ => ({
  state: {
    fauth: {
      authed: false,
      checked: false,
      user: {},
      error: {},
      hasIdentity: [],
    }
  },
  actions: {
    fauth: {
      setHasIdentity: (s,a,hasIdentity) => ({ fauth: Object.assign({}, s.fauth, { hasIdentity }) }),
      setUser: (s,a,user) => ({ fauth: Object.assign({}, s.fauth, { user }) }),
      setError: (s,a,error) => ({ fauth: Object.assign({}, s.fauth, { error }) }),
      signout: _ => _ => auth.signOut(),
      signin: (s,a,{email,password}) => {
        a.fauth.setError({})
        auth.signInWithEmailAndPassword(email, password)
          .catch(a.fauth.setError)
      },
      signup: (s,a,{email,password}) => {
        a.fauth.setError({})
        a.fauth.setUser({ email })
        auth.createUserWithEmailAndPassword(email, password)
          .catch(a.fauth.setError)
      },
      fetchProviders: (s,a,{email}) => {
        a.fauth.setError({})
        auth.fetchProvidersForEmail(email)
          .then(providers => {
            a.fauth.setUser({ email })
            a.fauth.setHasIdentity(providers)
          }).catch(a.fauth.setError)
      },
      userChanged: (s,a,user) => update => update({
        fauth: Object.assign({}, s.fauth, {
          user: user || {},
          authed: !!user,
          checked: true,
        })
      }),
      resetPassword: (s,a,d) => _ =>
        confirm(`Send a password reset email to ${s.fauth.user.email}?`) &&
        auth.sendPasswordResetEmail(s.fauth.user.email).then(_ =>
          alert(`A password reset email has been sent to ${s.fauth.user.email} please check your inbox.`)
        ).catch(a.setError),
      resetIdentity: s => ({
        fauth: Object.assign({}, s.fauth, {
          user: {},
          error: {}
        })
      }),
    }
  },
  events: {
    load: (s,a) => auth.onAuthStateChanged(a.fauth.userChanged),
    render: (s,a,v) => {
      if(!s.fauth.checked) return () => h('auth-check')
      if(!s.fauth.authed && v(s,a).data.auth) return $auth
    }
  },
})
