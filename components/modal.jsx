const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className=" flex justify-center items-center fixed inset-0  bg-black bg-opacity-70">
      <div className="shadow-lg">

     
        {children}
      </div>
    </div>
  );
};  

export default Modal;
