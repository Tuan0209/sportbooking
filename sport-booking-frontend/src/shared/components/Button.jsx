const Button = ({ children, onClick, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full bg-[#006a31] text-white font-bold py-3.5 rounded-lg hover:bg-[#004d24] transition-colors uppercase text-[15px] tracking-wide ${className}`}
  >
    {children}
  </button>
);

export default Button;