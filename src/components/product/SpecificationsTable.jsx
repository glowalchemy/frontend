import React from 'react';

/**
 * Semantic label/value specifications list (<dl>) fed by REAL product data
 * (management.details.technicalSpecs). Renders nothing when there is no data.
 */
const SpecificationsTable = ({ specs = [] }) => {
  const rows = Array.isArray(specs)
    ? specs.filter((s) => s && String(s?.key || '').trim() && String(s?.value ?? '').trim() !== '')
    : [];

  if (rows.length === 0) return null;

  return (
    <dl className="divide-y divide-glowalchemy-sand/70">
      {rows.map((s, idx) => (
        <div key={`${String(s.key)}-${idx}`} className="grid grid-cols-[minmax(0,9rem)_1fr] sm:grid-cols-[minmax(0,12rem)_1fr] gap-4 py-2.5">
          <dt className="text-sm text-glowalchemy-warm-gray">{s.key}</dt>
          <dd className="text-sm font-medium text-glowalchemy-charcoal break-words">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default SpecificationsTable;
