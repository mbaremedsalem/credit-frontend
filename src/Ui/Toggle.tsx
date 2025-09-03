import { Button } from "react-aria-components";

interface ToggleProps {
  options: string[];
  activeIndex: number;
  onToggle: (index: number) => void;
}

const Toggle: React.FC<ToggleProps> = ({ options, activeIndex, onToggle }) => {
  return (
    <div className="toggle flex items-center gap-x-[14px] border-[#e7e7e7] border py-[6.5px] px-[9.5px] rounded-[20px] ">
      {options.map((option, index) => (
        <Button
          key={index}
          onPress={() => onToggle(index)}
          className={`${
            activeIndex === index
              ? "bg-[#141317] text-white"
              : "text-black bg-transparent  hover:bg-[#e7e7e7]" 
          } w-[100px] h-7 text-[13px] rounded-[14px] px-4 text-center transition-all duration-300 ease-in-out focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1f4432]`}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default Toggle;