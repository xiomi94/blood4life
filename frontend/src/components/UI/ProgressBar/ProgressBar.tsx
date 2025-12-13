import React from 'react';

interface Step {
    label: string;
    description?: string;
}

interface ProgressBarProps {
    steps: Step[];
    currentStep: number;
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    steps,
    currentStep,
    className = '',
}) => {
    return (
        <nav aria-label="Progreso del formulario" className={className}>
            <ol className="flex items-center w-full">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isUpcoming = stepNumber > currentStep;

                    return (
                        <li
                            key={index}
                            className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''
                                }`}
                        >
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${isCompleted
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : isCurrent
                                                ? 'border-blue-600 text-blue-600 bg-white'
                                                : 'border-gray-300 text-gray-400 bg-white'
                                        }`}
                                    aria-current={isCurrent ? 'step' : undefined}
                                >
                                    {isCompleted ? (
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ) : (
                                        <span className="font-semibold">{stepNumber}</span>
                                    )}
                                </div>
                                <span
                                    className={`mt-2 text-sm font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'
                                        }`}
                                >
                                    {step.label}
                                </span>
                                {step.description && (
                                    <span className="mt-1 text-xs text-gray-400 text-center max-w-[100px]">
                                        {step.description}
                                    </span>
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-2 transition-colors ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default ProgressBar;
