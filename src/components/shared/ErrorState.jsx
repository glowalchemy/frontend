import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const ErrorState = ({ 
    title = 'Something went wrong', 
    description = 'An error occurred while loading the content. Please try again.',
    onRetry,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <FiAlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-trozzi-charcoal mb-2 text-center">
                {title}
            </h3>
            <p className="text-trozzi-warm-gray text-center max-w-sm mb-6">
                {description}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-trozzi-terracotta text-white px-6 py-3 rounded-xl hover:bg-trozzi-charcoal transition-colors font-medium flex items-center gap-2"
                >
                    <FiRefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorState;
