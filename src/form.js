import { h } from 'hyperapp'

const parseFormInputs = form =>
  Array.from(form.elements)
    .filter(input => input.type !== 'submit')
    .reduce((a,{ name, value }) => Object.assign(a, { [name]: value }), {})

export default ({
  key = 'form-' + Math.floor(Math.random()*100),
  titleText = 'Untitled Form',
  promptText = 'Please fill out and submit the form below',
  submitText = 'Submit',
  inputs = [{ name: 'lorem', type: 'text', placeholder: 'Example Input' }],
  action = data => console.log('Submitted', data),
  errorText = '',
  links = []
}) =>
h('form', {
  key,
  oncreate: e => e.elements[0].focus(),
  onsubmit: e => {
    e.preventDefault()
    return action(parseFormInputs(e.target))
  }
}, [
  h('header', {}, [
    h('h3', {}, titleText),
    h('p', {}, promptText),
  ]),
  inputs.map(props => h('label', { style: { display: props.type === 'hidden' ? 'none' : false }}, h('input', props))),
  errorText && h('error-', {}, errorText),
  h('button', { type: 'submit' }, submitText),
  h('footer', {}, links.map(x =>
    h('a', { href: '#', onclick: e => e.preventDefault() || x.action() }, x.text)
  )),
])
