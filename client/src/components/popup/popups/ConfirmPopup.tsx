import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Button } from '../../input/Button';
import { Modal } from '../Modal';
import { Panel } from '../Panel';

interface ConfirmPopupProps extends PropsWithChildren<{}> {
  visible: boolean;
  onClose(): void;
  onConfirm(): Promise<void>;
  closeButton?: string;
  confirmButton?: string;
  confirmButtonIcon?: IconDefinition;
  header?: ReactNode;
}

/**
 * Creates a confirmation popup
 * @param props The props object
 */
export function ConfirmPopup({
  visible, onClose, closeButton, onConfirm, confirmButton, confirmButtonIcon, header, children,
}: ConfirmPopupProps) {
  const [loading, setLoading] = useState(false);

  const handleOnConfirm = () => {
    setLoading(true);
    onConfirm()
      .then(() => {
        // setLoading(false);
      });
  };

  return (
    <Modal
      onClose={onClose}
      visible={visible}
    >
      <Panel
        onClose={onClose}
        closeButton={closeButton}
        header={header}
        footer={(
          <Button
            leftIcon={confirmButtonIcon}
            onClick={handleOnConfirm}
            loading={loading}
          >
            {confirmButton}
          </Button>
        )}
      >
        {children}
      </Panel>
    </Modal>
  );
}

ConfirmPopup.defaultProps = {
  closeButton: 'Cancel',
  confirmButton: 'Confirm',
  confirmButtonIcon: undefined,
  header: 'Confirm',
};
