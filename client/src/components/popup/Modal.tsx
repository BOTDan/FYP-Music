import React, {
  createRef, KeyboardEvent, MouseEvent, PropsWithChildren,
} from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

export interface ModalProps extends PropsWithChildren<{}> {
  visible: boolean;
  onClose?: () => void;
}

/**
 * Creates a modal for displaying things as a popup
 * @param props The props for the modal
 * @returns A modal element
 */
export function Modal({ children, visible, onClose }: ModalProps) {
  const parent = document.getElementById('modals');
  if (!parent) { throw new Error('Parent doesn\'t exist for modal'); }

  const div = createRef<HTMLDivElement>();

  function onClickOutside(event: MouseEvent) {
    if (event.target === div.current) {
      if (onClose) {
        onClose();
      }
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      if (onClose) {
        onClose();
      }
    }
  }

  const visibleClass = visible ? '' : 'hidden';

  return ReactDOM.createPortal(
    (
      <div
        ref={div}
        className={`Modal ${visibleClass}`}
        onClick={onClickOutside}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={-1}
      >
        { children }
      </div>
    ),
    parent,
  );
}
