import React from 'react';

export const StatusBadge = ({ statusCode }) => {
  const code = parseInt(statusCode, 10);
  let badgeClass = 'badge-2xx';

  if (code >= 500) badgeClass = 'badge-5xx';
  else if (code >= 400) badgeClass = 'badge-4xx';
  else if (code >= 300) badgeClass = 'badge-3xx';

  return (
    <span className={`badge-status ${badgeClass}`}>
      {statusCode}
    </span>
  );
};

export const MethodBadge = ({ method }) => {
  const m = (method || 'GET').toUpperCase();
  return (
    <span className={`badge-method method-${m}`}>
      {m}
    </span>
  );
};

export const LevelBadge = ({ level }) => {
  const lvl = (level || 'info').toLowerCase();
  let badgeClass = 'level-info';
  if (lvl === 'error') badgeClass = 'level-error';
  if (lvl === 'warn') badgeClass = 'level-warn';

  return (
    <span className={`badge-status ${badgeClass}`}>
      {lvl.toUpperCase()}
    </span>
  );
};

export default { StatusBadge, MethodBadge, LevelBadge };
