const Button = ({ children, onClick, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`group relative w-full overflow-hidden bg-pitch text-white font-display font-bold py-3.5 rounded-2xl hover:bg-pitch-deep transition-all text-[15px] tracking-wide shadow-glow active:scale-[0.98] ${className}`}
  >
    {/* Ánh đèn pha quét qua khi hover */}
    <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    <span className="relative">{children}</span>
  </button>
);

export default Button;
