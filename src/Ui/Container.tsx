import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function Container({ children }: Props) {
  return (
    <div className="mt-[50px] p-6 bg-white rounded-[22px] px-5 py-7 ">
      {children}
    </div>
  );
}

export default Container;
