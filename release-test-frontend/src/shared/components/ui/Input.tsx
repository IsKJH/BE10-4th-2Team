import React, { forwardRef } from 'react';

export type InputVariant = 'default' | 'filled' | 'bordered';
export type InputSize = 'sm' | 'md' | 'lg';

interface BaseInputProps {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface InputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {}

interface TextareaProps extends BaseInputProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  rows?: number;
  resize?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  label,
  error,
  helpText,
  required = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'input';
  const variantClasses = `input-${variant}`;
  const sizeClasses = `input-${size}`;
  const errorClasses = error ? 'input-error' : '';
  const fullWidthClasses = fullWidth ? 'input-full' : '';
  const hasIconClasses = leftIcon ? 'input-has-left-icon' : rightIcon ? 'input-has-right-icon' : '';
  
  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    errorClasses,
    fullWidthClasses,
    hasIconClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper-full' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        {leftIcon && <div className="input-icon input-icon-left">{leftIcon}</div>}
        <input
          ref={ref}
          id={inputId}
          className={combinedClasses}
          {...props}
        />
        {rightIcon && <div className="input-icon input-icon-right">{rightIcon}</div>}
      </div>
      {error && <div className="input-error-text">{error}</div>}
      {helpText && !error && <div className="input-help-text">{helpText}</div>}
    </div>
  );
});

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  variant = 'default',
  size = 'md',
  label,
  error,
  helpText,
  required = false,
  fullWidth = false,
  rows = 3,
  resize = true,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseClasses = 'input textarea';
  const variantClasses = `input-${variant}`;
  const sizeClasses = `input-${size}`;
  const errorClasses = error ? 'input-error' : '';
  const fullWidthClasses = fullWidth ? 'input-full' : '';
  const resizeClasses = resize ? 'textarea-resize' : 'textarea-no-resize';
  
  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    errorClasses,
    fullWidthClasses,
    resizeClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper-full' : ''}`}>
      {label && (
        <label htmlFor={textareaId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={combinedClasses}
        {...props}
      />
      {error && <div className="input-error-text">{error}</div>}
      {helpText && !error && <div className="input-help-text">{helpText}</div>}
    </div>
  );
});

Input.displayName = 'Input';
Textarea.displayName = 'Textarea';

export { Input, Textarea };
export default Input;