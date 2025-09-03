import { Checkbox, ConfigProvider, CheckboxProps } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

type CustomCheckboxProps = CheckboxProps & {
  value: string | boolean | number;
  label: string;
  colorPrimary?: string;
  checked?: boolean;
  onChange: (e: CheckboxChangeEvent) => void;
};

const CustomCheckbox = ({
  value,
  label,
  colorPrimary = "#141317",
  checked,
  onChange,
  ...props
}: CustomCheckboxProps) => {
  const handleChange: CheckboxProps["onChange"] = (e) => {
    onChange(e);
  };

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: colorPrimary },
      }}
    >
      <Checkbox
        value={value}
        checked={checked}
        onChange={handleChange}
        {...props}
      >
        {label}
      </Checkbox>
    </ConfigProvider>
  );
};

export default CustomCheckbox;
