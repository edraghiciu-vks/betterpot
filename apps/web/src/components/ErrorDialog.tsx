// Modern error dialog component using HTML5 dialog element
import { Show, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import './ErrorDialog.css'

interface ErrorDialogProps {
  isOpen: boolean
  title?: string
  message: string
  details?: string
  onClose: () => void
}

export function ErrorDialog(props: ErrorDialogProps) {
  let dialogRef: HTMLDialogElement | undefined

  onMount(() => {
    if (!dialogRef) return

    // Handle dialog open/close based on props
    if (props.isOpen && !dialogRef.open) {
      dialogRef.showModal()
    } else if (!props.isOpen && dialogRef.open) {
      dialogRef.close()
    }
  })

  return (
    <Portal>
      <dialog
        ref={dialogRef}
        class="error-dialog"
        onClose={props.onClose}
      >
        <div class="error-dialog__content">
          <header class="error-dialog__header">
            <h2 class="error-dialog__title">
              {props.title || 'Error'}
            </h2>
            <button
              class="error-dialog__close-button"
              onClick={props.onClose}
              type="button"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </header>

          <div class="error-dialog__body">
            <div class="error-dialog__icon">
              ⚠️
            </div>
            <p class="error-dialog__message">
              {props.message}
            </p>
            
            <Show when={props.details}>
              <details class="error-dialog__details">
                <summary>Technical Details</summary>
                <pre class="error-dialog__details-text">
                  {props.details}
                </pre>
              </details>
            </Show>
          </div>

          <footer class="error-dialog__footer">
            <button
              class="error-dialog__button error-dialog__button--primary"
              onClick={props.onClose}
              type="button"
            >
              OK
            </button>
          </footer>
        </div>
      </dialog>
    </Portal>
  )
}