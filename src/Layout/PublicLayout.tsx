


import { ReactNode } from "react"
// import SidePublic from "./SidePublic"

type LayoutProps = {
    children: ReactNode
  }
  

const PublicLayout = ({children} : LayoutProps) => (
    
    <div className="">
    {/* <SidePublic/> */}
    {children}
  </div>
  )

export default PublicLayout

