import React from 'react';
import { colorNameToHex } from '../../utils/colorVariants';

const ColorPicker = ({
    colors = [],
    selectedColor = null,
    onColorSelect,
    size = 'medium',
    showLabels = true
}) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-10 h-10'
    };

    const containerClasses = {
        small: 'gap-2',
        medium: 'gap-3',
        large: 'gap-4'
    };

    return (
        <div className={`flex items-center ${containerClasses[size]}`}>
            {colors.map((color, index) => (
                <div key={index} className="relative group">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onColorSelect(color);
                        }}
                        className={`
              ${sizeClasses[size]} 
              rounded-full border-2 transition-all duration-200 
              ${selectedColor === color.color
                                ? 'border-brand-primary ring-2 ring-brand-primary/25 scale-110'
                                : 'border-brand-line hover:border-brand-sage hover:scale-105'
                            }
            `}
                        style={{ backgroundColor: color?.colorCode || colorNameToHex(color?.colorName || color?.color) }}
                        title={color.colorName}
                    >

                    </button>

                    {showLabels && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs text-brand-muted whitespace-nowrap bg-white px-1 rounded shadow">
                                {color.colorName}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ColorPicker;
