# React A11yDialog

react-a11y-dialog is a thin React component for [a11y-dialog](https://github.com/edenspiekermann/a11y-dialog) relying on [React portals](https://reactjs.org/docs/portals.html) to ease the use of accessible dialog windows in React applications.

Version compatibility:

- For React versions **before** 16, use `react-a11y-dialog@2.0.0`.
- For React versions **before** 16.8, use `react-a11y-dialog@4.2.0`.

_Special thanks to Moritz Kröger (@morkro) for his kind help in making that library better._

- [Install](#install)
- [API](#api)
- [Hook](#hook)
- [Server-side Rendering](#server-side-rendering)
- [Mocking portals in tests](#mocking-portals-in-tests)
- [Example](#example)

## Install

```sh
npm install --save react-a11y-dialog
```

## API

- **Property name**: `id`
- **Type**: string
- **Required**: true
- **Default value**: —
- **Description**: The HTML `id` attribute of the dialog element, internally used by a11y-dialog to manipulate the dialog.

---

- **Property name**: `title`
- **Type**: string | element
- **Required**: true
- **Default value**: —
- **Description**: The title of the dialog, mandatory in the document to provide context to assistive technology. Could be [hidden with CSS](https://hugogiraudel.com/2016/10/13/css-hide-and-seek/) (while remaining accessible).

---

- **Property name**: `dialogRef`
- **Type**: function
- **Required**: false
- **Default value**: no-op
- **Description**: A function called when the component has mounted, receiving the [instance of A11yDialog](http://edenspiekermann.github.io/a11y-dialog/#js-api) so that it can be programmatically accessed later on.

---

- **Property name**: `appRoot`
- **Type**: string | string[]
- **Required**: true
- **Default value**: —
- **Description**: The [selector(s) a11y-dialog need](http://edenspiekermann.github.io/a11y-dialog/#javascript-instantiation) to disable when the dialog is open.

---

- **Property name**: `dialogRoot`
- **Type**: string
- **Required**: true
- **Default value**: —
- **Description**: The container for the dialog to be rendered into ([React portal](https://reactjs.org/docs/portals.html)’s root).

---

- **Property name**: `titleId`
- **Type**: string
- **Required**: false
- **Default value**: `${this.props.id}-title`
- **Description**: The HTML `id` attribute of the dialog’s title element, used by assistive technologies to provide context and meaning to the dialog window.

---

- **Property name**: `closeButtonLabel`
- **Type**: string
- **Required**: false
- **Default value**: “Close this dialog window”
- **Description**: The HTML `aria-label` attribute of the close button, used by assistive technologies to provide extra meaning to the usual cross-mark.

---

- **Property name**: `closeButtonContent`
- **Type**: string | element
- **Required**: false
- **Default value**: `\u00D7` (×)
- **Description**: The string that is the inner HTML of the close button.

---

- **Property name**: `closeButtonPosition`
- **Type**: string
- **Required**: false
- **Default value**: `first`
- **Description**: Whether to render the close button as first element, last element or not at all. Options are: `first`, `last` and `none`. ⚠️ **Caution!** Setting it to `none` without providing a close button manually will be a critical accessibility issue.

---

- **Property name**: `classNames`
- **Type**: object
- **Required**: false
- **Default value**: {}
- **Description**: Object of classes for each HTML element of the dialog element. Keys are: `container`, `overlay`, `dialog`, `inner`, `title`, `closeButton`. See [a11y-dialog docs](http://edenspiekermann.github.io/a11y-dialog/#expected-dom-structure) for reference.

---

- **Property name**: `useDialogElement`
- **Type**: boolean
- **Required**: false
- **Default value**: `false`
- **Description**: Whether to render a `<dialog>` element or a `<div>` element and [let `a11y-dialog` polyfill it](http://edenspiekermann.github.io/a11y-dialog/#expected-dom-structure). The `<dialog>` element—while native HTML—is harder to style, and causes several browser inconsistencies. Additionally, [it _cannot_ work with `role="alertdialog"`](https://github.com/edenspiekermann/a11y-dialog/issues/115).

---

- **Property name**: `role`
- **Type**: string
- **Required**: false
- **Default value**: `dialog`
- **Description**: The `role` attribute of the dialog element, either `dialog` (default) or `alertdialog` to make it a modal (preventing closing on click outside of <kbd>ESC</kbd> key).

## Hook

The library exports both `A11yDialog`, a React component rendering a dialog while performing the `a11y-dialog` bindings under the hood, and a `useA11yDialog` hook providing only the binding logic without any markup.

Using the hook can be handy when building your own dialog. Beware though, **it is an advanced feature**. Make sure to [stick to the expected markup](http://edenspiekermann.github.io/a11y-dialog/#expected-dom-structure).

```js
import { useA11yDialog } from 'react-a11y-dialog'

const MyCustomDialog = props => {
  // `instance` is the `a11y-dialog` instance.
  // `attr` is an object with the following keys:
  // - `container`: the dialog container
  // - `overlay`: the dialog overlay (sometimes called backdrop)
  // - `dialog`: the actual dialog box
  // - `inner`: the inner dialog container
  // - `title`: the dialog mandatory title
  // - `closeButton`:  the dialog close button
  const [instance, attr] = useA11yDialog({
    // The required HTML `id` attribute of the dialog element, internally used
    // a11y-dialog to manipulate the dialog.
    id: 'my-dialog',
    // The selector(s) a11y-dialog need to “disable” when the dialog is open.
    // See: http://edenspiekermann.github.io/a11y-dialog/#javascript-instantiation
    appRoot: '#root',
    // The optional `role` attribute of the dialog element, either `dialog`
    // (default) or `alertdialog` to make it a modal (preventing closing on
    // click outside of ESC key).
    // Warning: do not use `alertdialog` if you plan on using the <dialog> HTML
    // element as they are mutually exclusive. A modal (`role="alertdialog"`)
    // should *not* use the <dialog> HTML element at all.
    role: 'dialog',
  })

  const dialog = ReactDOM.createPortal(
    <div {...attr.container} className='dialog-container'>
      <div {...attr.overlay} className='dialog-overlay' />
      <div {...attr.dialog} className='dialog-element'>
        <div {...attr.inner} className='dialog-inner'>
          <p {...attr.title} className='dialog-title'>
            Your dialog title
          </p>
          <p>Your dialog content</p>
          <button {...attr.closeButton} className='dialog-close'>
            Close dialog
          </button>
        </div>
      </div>
    </div>,
    document.querySelector('#dialog-root')
  )

  return (
    <React.Fragment>
      <button type='button' onClick={() => instance.show()}>
        Open dialog
      </button>
      {dialog}
    </React.Fragment>
  )
}
```

## Server-side rendering

`react-a11y-dialog` does not render anything on the server, and waits for the client bundle to kick in to render the dialog through the React portal.

## Mocking portals in tests

When you’re using `react-a11y-dialog` in your unit tests, it is necessary to mock React Portals and inject them to the root DOM before your tests are running. To accomplish that, create helper functions that attach all portals before a test and remove them afterwards.

```js
const ROOT_PORTAL_IDS = ['dialog-root']

export const addPortalRoots = () => {
  for (const id of ROOT_PORTAL_IDS) {
    if (!global.document.querySelector('#' + id)) {
      const rootNode = global.document.createElement('div')
      rootNode.setAttribute('id', id)
      global.document.body.appendChild(rootNode)
    }
  }
}

export const removePortalRoots = () => {
  for (const id of rootPortalIds) {
    global.document.querySelector('#' + id)?.remove()
  }
}
```

And then use them in your tests.

```js
describe('Testing MyComponent', () => {
  beforeAll(() => addPortalRoots())
  afterAll(() => removePortalRoots())
})
```

## Example

```jsx
import { A11yDialog } from 'react-a11y-dialog'

class MyComponent extends React.Component {
  handleClick = () => {
    this.dialog.show()
  }

  render() {
    return (
      <div>
        <button type='button' onClick={this.handleClick}>
          Open the dialog
        </button>

        <A11yDialog
          id='my-accessible-dialog'
          appRoot='#main'
          dialogRoot='#dialog-root'
          dialogRef={dialog => (this.dialog = dialog)}
          title='The dialog title'
        >
          <p>Some content for the dialog.</p>
        </A11yDialog>
      </div>
    )
  }
}

ReactDOM.render(<MyComponent />, document.getElementById('main'))
```

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="main">
      <!-- Container in which the entire React application is rendered. -->
    </div>
    <div id="dialog-root">
      <!-- Container in which dialogs are rendered through a React portal. -->
    </div>
  </body>
</html>
```
