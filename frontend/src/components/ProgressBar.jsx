const ProgressBar = ({ progress, size = 'md', color = 'primary' }) => {
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  
  const colors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-full ${height} overflow-hidden`}>
        <div 
          className={`${colors[color] || colors.primary} h-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
