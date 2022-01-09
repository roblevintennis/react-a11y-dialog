import React from 'react';
import { A11yDialog } from 'react-a11y-dialog';
import './App.css';

const BASE_PROPS = {
  id: 'my-accessible-dialog',
  title: 'The dialog title',
  classNames: {
    container: 'dialog',
    overlay: 'dialog-overlay',
    dialog: 'dialog-content',
    title: 'dialog-title',
    closeButton: 'dialog-close',
  },
}

const App = () => {
  const dialog = React.useRef()

  return (
    <div>
      <button type='button' onClick={() => dialog.current.show()}>
        Open the dialog
      </button>

      <A11yDialog
        {...BASE_PROPS}
        dialogRef={dialogInstance => (dialog.current = dialogInstance)}
      >
        <p>Some content for the dialog.</p>
      </A11yDialog>
    </div>
  )
}

export default App;