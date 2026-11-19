import React from 'react';

const LoadingSkeleton = ({ className = '', variant = 'default' }) => {
    const baseClasses = 'animate-pulse bg-glowalchemy-sand rounded';
    
    const variants = {
        default: 'h-4 w-full',
        text: 'h-4 w-3/4',
        title: 'h-6 w-1/2',
        avatar: 'h-12 w-12 rounded-full',
        button: 'h-10 w-24',
        card: 'h-48 w-full',
        image: 'h-48 w-full',
        input: 'h-10 w-full',
    };

    const variantClasses = variants[variant] || variants.default;

    return (
        <div className={`${baseClasses} ${variantClasses} ${className}`} />
    );
};

const CardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-glowalchemy-sand overflow-hidden">
        <LoadingSkeleton variant="image" className="h-48" />
        <div className="p-4 space-y-3">
            <LoadingSkeleton variant="title" />
            <LoadingSkeleton variant="text" />
            <LoadingSkeleton variant="text" className="w-1/2" />
            <div className="flex gap-2 mt-4">
                <LoadingSkeleton variant="button" />
            </div>
        </div>
    </div>
);

const ProductCardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-glowalchemy-sand overflow-hidden">
        <div className="aspect-[4/5] w-full">
            <LoadingSkeleton variant="image" className="h-full w-full" />
        </div>
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            <LoadingSkeleton variant="text" />
            <LoadingSkeleton variant="text" className="w-2/3" />
            <div className="flex items-center gap-2 mt-2">
                <LoadingSkeleton variant="text" className="w-14 sm:w-16 h-4 sm:h-5" />
            </div>
        </div>
    </div>
);

const ListSkeleton = ({ count = 5 }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
                <LoadingSkeleton variant="avatar" />
                <div className="flex-1 space-y-2">
                    <LoadingSkeleton variant="text" />
                    <LoadingSkeleton variant="text" className="w-2/3" />
                </div>
            </div>
        ))}
    </div>
);

export { LoadingSkeleton, CardSkeleton, ProductCardSkeleton, ListSkeleton };
export default LoadingSkeleton;
