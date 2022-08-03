# Plato: Starter

- **Creator:** Timothee Roussilhe
- **Twitter:** [@timroussilhe](https://twitter.com/TimRoussilhe)

![](https://media1.giphy.com/media/eLudircQfgGEU/giphy.gif?cid=3640f6095c0e8e92753069696f5d90c5)

---

## CES Naming Convention

Component classes should be named following a CES naming convention: component\_\_element--state.

- Component: A standalone entity that is meaningful on its own.
- Element: A part of the component that we want to style.
- State: The state of the element.
- Should NOT be modified by javascript once instantiated.
- If a state IS modified by javascript, it doesn't need to follow CES (ex. toggling `is-active`)
- Should be positive (ex. `--has-wrapping` instead of `--without-wrapping`)
  Unlike BEM, `__element` should be at most one level below the component. This avoids deep nesting but keeps an important level of specificity.
  It's fine to not use the top-level component name if we are styling a nuclear component by itself like a `button`. Specific Component scope className would then be used to add more style that's needed in the context of the parent component.
  For utility classes that embody some logic, we use a simple pattern of the utility description separated by a dash, no need to always attach this to the component as a modifier if it's something global: `justify-start` or `font-style-title`.
  Example:

```
<div class="chat-notification chat-notification--theme-white">
 <div class="chat-notification__logo-wrapper">
 <img class="chat-notification__logo" src="/img/logo.svg" alt="ChitChat Logo">
 </div>
 <div class="chat-notification__content flex-align-center">
 <h4 class="chat-notification__title font-style-subtitle">ChitChat</h4>
 <p class="chat-notification__message">You have a new message!</p>
 </div>
</div>
```

## Component State

Each state comes with a simple local state management.
The state is not attached to any update or render methods but you can pass a callback method when using `setState`.

```
// Declare initial states in constructor
this.state = {
    canUpdate: false,
    isInit: false,
    isAnimating: false,
    isShown: false,
}

// Update State
this.setState({ isAnimating: false})

// you can also pass a callback or render the component
this.setState({ isAnimating: true }, () => this.onIsAnimatingUpdate()))

// when you call setState, after that the state been

// Read the state
if ( this.state.canUpdate ) this.onUpdate()

```
