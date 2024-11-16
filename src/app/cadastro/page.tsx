"use client"
import { useAuth } from "@/context/auth"
import Link from "next/link"
import Logo from "../../../public/logo.jpg"

const Page = () => {
  

  return (
    
    <section>
    
    <div className="grid md:h-screen md:grid-cols-2">
    
    
    
    <div className="flex flex-col items-center justify-center  " style={{ backgroundImage: "url('logo.jpg')" }}>
      
    </div>
    



     
      <div className="flex flex-col items-center justify-center bg-[#89b6d5]">
    
        <div className="max-w-lg px-5 py-16 text-center md:px-10 md:py-24 lg:py-32">
       
       
        <img alt="" src="/usuario.png" className="relative  inline-block w-100 h-100" />
             
       
      
          <form className="mx-auto mt-12 mb-4 max-w-sm pb-4" name="wf-form-password" method="get">
            <div className="relative">
              <img alt="" src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f190b7e37f878_EnvelopeSimple.svg" className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block" />
              <input type="email" className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333] rounded-full"  name="name" placeholder="Email Address" />
            </div>
            <div className="relative mb-4">
              <img alt="" src="https://assets.website-files.com/6357722e2a5f19121d37f84d/6357722e2a5f19601037f879_Lock-2.svg" className="absolute bottom-0 left-[5%] right-auto top-[26%] inline-block" />
              <input type="password" className="mb-4 block h-9 w-full border border-black bg-[#f2f2f7] px-3 py-6 pl-14 text-sm text-[#333333] rounded-full" placeholder="Password (min 8 characters)"  />
            </div>
           
            <label className="mb-6 flex items-center pb-12 font-medium lg:mb-1">
              <input type="checkbox" name="checkbox" />
              <span className="ml-4 inline-block cursor-pointer text-sm" >Eu concordo com os <a href="#" className="font-bold text-[#0b0b1f]">Termos &amp; Condições</a>
              </span>
            </label>
            
            <a href="#" className="flex items-center justify-center bg-[#276ef1] px-8 py-4 text-center font-semibold text-white rounded-full">
              <p className="mr-6 font-bold">Login</p>
              <svg className="h-4 w-4 flex-none" fill="currentColor" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
                <title>Arrow Right</title>
                <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
              </svg>
            </a>
          </form>
          <p className="text-sm text-[#636262]">Já possui uma conta? <a href="#" className="text-sm font-bold text-black">Login now</a>
          </p>
        </div>
      </div>

     
    </div>
  </section>
  
  )
}

export default Page