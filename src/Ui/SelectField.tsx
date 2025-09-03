
import { Controller } from "react-hook-form";
import { ControlledFieldProps, SelectFieldProps } from "./types";

import { Select } from "antd";
import { baseStyles, FormField } from "./FormField";

export const SelectField = ({
  control,
  name,
  label,
  options,
  placeholder,
  required,
  disabled,
  rules,
  className,
  wrapperClassName,
  mode,
  defaultValue,
  variant = "borderless",
  prefix,
  suffix
}: SelectFieldProps & ControlledFieldProps) => (
  <Controller
    name={name}
    control={control}
    rules={{ required: required && "Ce champ est obligatoire", ...rules }}
    render={({ field, fieldState: { error } }) => (
      <FormField
        label={label}
        error={error?.message}
        className={wrapperClassName}
      >
        <Select
          {...field}
          mode={mode}
          options={options}
          placeholder={placeholder}
          disabled={disabled}
          prefix={prefix}
          suffixIcon = {suffix}
          variant={variant}
          status={error ? "error" : ""}
          className={`${baseStyles.input} ${className} ${error?'border-red-500' : ''}`}
          defaultValue={defaultValue}
        />
      </FormField>
    )}
  />
);
