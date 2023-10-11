import React, { memo, useCallback, useState, ChangeEvent } from 'react';
import { Input, InputAdornment, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useDidUpdateEffect } from 'utils/useDidUpdateEffect';

type AdornmentParams = {
    adornmentContent: React.ReactNode,
    adornmentPosition: 'start' | 'end',
    adornmentHandle: () => void,
};

function getAdornment(params: AdornmentParams) {
    const { adornmentContent, adornmentPosition, adornmentHandle } = params;
    return (
        <InputAdornment position={adornmentPosition}>
            <IconButton onClick={adornmentHandle}>
                {adornmentContent}
            </IconButton>
        </InputAdornment>
    );
}

type MainInputProps = {
    className?: string,
    containerClassName?: string,
    readOnly?: boolean,
    name?: string,
    autoFocus?: boolean,
    maxLength?: number,
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>,
    isDisabled?: boolean,
    value: string | number,
    onChange: (value: string) => void,
    placeholder?: string,
    errorField?: string,
    required?: boolean,
    type?: string,
    adornment?: React.ReactNode,
    adornmentHandle?: () => void,
    validator?: (value: string | number) => string | undefined,
};

function MainInput({
    className,
    containerClassName,
    readOnly,
    name,
    autoFocus,
    maxLength,
    inputProps = {},
    isDisabled,
    value,
    onChange,
    placeholder,
    errorField,
    required,
    type,
    adornment,
    adornmentHandle,
    validator,
}: MainInputProps) {
    const [error, setError] = (useState < string) | (undefined > '');

    const propsInput: Record<string, any> = {};

    if (adornment) {
        const params: AdornmentParams = {
            adornmentContent: adornment,
            adornmentPosition: 'end',
            adornmentHandle: adornmentHandle || (() => {}),
        };
        propsInput.endAdornment = getAdornment(params);
    }

    const handleInputValidation = useCallback(() => {
        let errorMess: string | undefined = undefined;

        if (validator) {
            errorMess = validator(value);
        }
        if (required && !value) {
            errorMess = `Please enter ${errorField}`;
        }
        if (value.toString().length > (maxLength || 0)) {
            errorMess = `${maxLength} person limit exceeded`;
        }
        setError(errorMess);
    }, [errorField, required, validator, value, maxLength]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.currentTarget.value);
    };

    const handleBlur = () => {
        handleInputValidation();
    };

    useDidUpdateEffect(() => {
        handleInputValidation();
    }, [value]);

    return (
        <div className={containerClassName}>
            <Input
                placeholder={placeholder}
                type={type || 'text'}
                className={`${required && 'required-field'} input-container ${
                    !readOnly && 'input-focusable'
                } ${className || ''}`}
                variant="outlined"
                fullWidth
                disableUnderline
                value={value}
                name={name}
                onChange={handleChange}
                onBlur={handleBlur}
                required={required}
                readOnly={readOnly}
                error={!!error}
                autoFocus={autoFocus}
                inputProps={inputProps}
                disabled={isDisabled}
                {...propsInput}
            />
            <div className="error-message">{error}</div>
        </div>
    );
}

export default memo(MainInput);

MainInput.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    errorField: PropTypes.string,
    required: PropTypes.bool,
    type: PropTypes.string,
    name: PropTypes.string,
    adornment: PropTypes.node,
    adornmentHandle: PropTypes.func,
    validator: PropTypes.func,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    maxLength: PropTypes.number,
};
