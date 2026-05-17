const StatusBadge = ({ status }) => {
  const styles = {
    Approved: 'bg-success/10 text-success',
    Rejected: 'bg-danger/10 text-danger',
    Pending: 'bg-warning/10 text-warning',
    'On Track': 'bg-primary/10 text-primary',
    'Completed': 'bg-success/10 text-success',
    'Not Started': 'bg-slate-100 text-slate-500',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
