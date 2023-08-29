import RawModal from './RawModal';

function DragDrop({ isOpen }) {
  return (
    <RawModal
      className="drag-drop__modal flex items-center justify-center"
      overlayClassName="drag-drop__overlay"
      isOpen={isOpen}
    >
      <h2 className='font-bold text-2xl text-white !z-50'>Drop file to upload</h2>
    </RawModal>
  );
}

export default DragDrop;
