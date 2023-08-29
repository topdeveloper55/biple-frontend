import { useEffect } from 'react';
import Modal from 'react-modal';
import navigation from 'services/navigation';
import 'styles/mixin/_raw__modal.css'

Modal.setAppElement('#root');

function RawModal({
  className, overlayClassName,
  isOpen, size, onAfterOpen, onAfterClose,
  onRequestClose, closeFromOutside, children,
}) {
  let modalClass = (className !== null) ? `${className} ` : '';
  switch (size) {
    case 'large':
      modalClass += 'raw-modal__large ';
      break;
    case 'medium':
      modalClass += 'raw-modal__medium ';
      break;
    case 'small':
    default:
      modalClass += 'raw-modal__small ';
  }

  useEffect(() => {
    navigation.setIsRawModalVisible(isOpen);
  }, [isOpen]);

  const modalOverlayClass = (overlayClassName !== null) ? `${overlayClassName} ` : '';
  return (
    <Modal
      className={`${modalClass}raw-modal`}
      overlayClassName={`${modalOverlayClass}raw-modal__overlay`}
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc={closeFromOutside}
      shouldCloseOnOverlayClick={closeFromOutside}
      shouldReturnFocusAfterClose={false}
    >
      {children}
    </Modal>
  );
}

RawModal.defaultProps = {
  className: null,
  overlayClassName: null,
  size: 'small',
  onAfterOpen: null,
  onAfterClose: null,
  onRequestClose: null,
  closeFromOutside: true,
};

export default RawModal;
