export const baseStyles = {
    input:
      "px-4 border text-[#414141] border-[#e7e7e7]  text-sm rounded-full h-12",
    label: "block ",
    error: "text-red-500 text-xs mt-1",
    wrapper: "flex flex-col gap-2",
    readonly: "bg-[#fbfbfb]",
  };
  
  export const FormField = ({
    label,
    error,
    className,
    children,
  }: {
    label: string;
    error?: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <div className={`${baseStyles.wrapper} ${className}`}>
      <label className={baseStyles.label}>{label}</label>
      {children}
      {error && <span className={baseStyles.error}>{error}</span>}
    </div>
  );
  