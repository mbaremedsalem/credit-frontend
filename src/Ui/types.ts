import dayjs from "dayjs";
import { Control } from "react-hook-form";

export interface FieldOption {
  label: string;
  value: string | number;
}


export type DisabledTimes = {
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number) => number[];
  disabledSeconds?: (hour: number, minute: number) => number[];
};

export interface BaseFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  prefix?: string;
  suffix?: string;
  min?: string;
  max?: string;
  messageError?:string;
  onChange? : (value:string|number)=>void
  disabledTime?: (date: dayjs.Dayjs) => DisabledTimes;
}

export interface InputFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "password" | "number" | "tel"| "date"| "Time";
  readOnly?: boolean;
}

export interface SelectFieldProps extends BaseFieldProps {
  options: FieldOption[] | undefined;
  defaultValue?: string | number;
  variant?: "outlined" | "borderless" | "filled" | undefined;
  mode?: "multiple";
}

export interface ControlledFieldProps {
  control: Control<any>;
  rules?: Record<string, any>;
}

export interface DatePickerFieldProps {
  label: string;
  required?: boolean;
  name: string;
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
}

export interface TimePickerFieldProps {
  label: string;
  required?: boolean;
  name: string;
  className?: string;
  wrapperClassName?: string;
  placeholder?: string;
  disabledHours?:string

}