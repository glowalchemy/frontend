import React from 'react';

/**
 * Structural PDP skeleton. Mirrors the final two-column layout so the page
 * has visible shape immediately — no full-page spinner. Image region and
 * information region load independently of each other.
 */
const Block = ({ className = '' }) => (
  <div className={`animate-pulse bg-trozzi-sand/40 rounded-lg ${className}`} aria-hidden="true" />
);

const ProductPdpSkeleton = () => (
  <div className="max-w-7xl mx-auto" aria-busy="true" aria-label="Loading product">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      {/* Gallery skeleton */}
      <div className="p-4 sm:p-6 lg:p-8 bg-trozzi-ivory/50">
        <Block className="aspect-square w-full rounded-xl" />
        <div className="flex gap-2 mt-3">
          <Block className="w-16 h-16 rounded-lg" />
          <Block className="w-16 h-16 rounded-lg" />
          <Block className="w-16 h-16 rounded-lg" />
        </div>
      </div>

      {/* Information skeleton */}
      <div className="p-5 sm:p-6 lg:p-8 space-y-4">
        <Block className="h-3 w-28" />
        <Block className="h-5 w-full" />
        <Block className="h-5 w-3/4" />
        <Block className="h-4 w-1/2" />
        <Block className="h-9 w-40" />
        <Block className="h-4 w-24" />
        <div className="flex gap-3 pt-2">
          <Block className="h-12 flex-1 rounded-xl" />
          <Block className="h-12 flex-1 rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <Block className="h-20 rounded-xl" />
          <Block className="h-20 rounded-xl" />
          <Block className="h-20 rounded-xl" />
        </div>
      </div>
    </div>

    {/* Sections skeleton */}
    <div className="space-y-4 mb-6">
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
        <Block className="h-5 w-40" />
        <Block className="h-4 w-full" />
        <Block className="h-4 w-5/6" />
        <Block className="h-4 w-2/3" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
        <Block className="h-5 w-48" />
        <Block className="h-4 w-full" />
        <Block className="h-4 w-3/4" />
      </div>
    </div>

    {/* Reviews skeleton */}
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
      <Block className="h-5 w-40" />
      <Block className="h-4 w-2/3" />
      <Block className="h-16 w-full" />
      <Block className="h-16 w-full" />
    </div>
  </div>
);

export default ProductPdpSkeleton;
