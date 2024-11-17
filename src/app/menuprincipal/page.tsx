"use client"
import { useState } from "react";

const Page = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[isbuscaraula, setisbuscaraula] = useState(false)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const buscar = () => {
    setisbuscaraula(!isbuscaraula);
  }
    return (
      
      <section>
      
      
      <div className="grid md:h-screen md:grid-cols-[350px_1fr]">
      
      
      
      <div className="flex flex-col items-center justify-center bg-[#89b6d5]">
    
        <div className="max-w-lg text-center md:px-10 md:py-24 lg:py-32">
       
       
        <img alt="" src="/usuario.png" className="relative  inline-block w-100 h-100" />
             
       
      
          <div className="mx-auto w-full mt-12 mb-4 pb-4 ">
            <div className="relative">
                 <button className=" font-bold font-spartan text-[40px] mb-4 block   w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">AGENDA</button>
            </div>
            <div className="relative">
                 <button className="font-bold font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">ALUNOS</button>
            </div>
            <div className="relative">
                 <button className="font-bold font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">EQUIPE</button>
            </div>
            <div className="relative">
                 <button className="font-bold px-18 font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">FINANCEIRO</button>
            </div>
          </div>
         
        </div>
      </div>



<div className=" bg-no-repeat bg-cover  " style={{ backgroundImage: "url('fundo.png')" }}>
     <div className="flex flex justify-end gap-4">
      
 
  <button  onClick={toggleModal} className=" bg-blue-500 text-white rounded hover:bg-blue-600">Novo Agendamento</button>
  <button  onClick={buscar} className=" bg-blue-500 text-white rounded hover:bg-blue-600">Buscar Aulas</button>

  

        
  {isModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
          <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
            <div className=" w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">

    <div className="w-full  mx-auto mt-8">
   
            <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Data:</label>
                        <input type="text" id="first_name" className="w-60 rounded-lg border py-2 px-3"/>
                    </div>
                    <div>
                    <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Hora:</label>
              <input 
                type="text" 
                id="last_name" 
                className="w-60 rounded-lg border py-2 px-3 " 
              />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div>
                        <label htmlFor="aluno" className="block text-[18px] font-bold text-[#9f968a] mb-1">Aluno:</label>
                        <input type="text" id="aluno" className="w-80 rounded-lg border py-2 px-3"/>
                        <label htmlFor="Instrutor:" className="block text-[18px] font-bold text-[#9f968a] mt-3 mb-1">Instrutor:</label>
                        <input type="text" id="Instrutor:" className="w-80 rounded-lg border py-2 px-3 "/>
                 
                    </div>
                    <div>
                        <label htmlFor="observacao" className="block text-[18px] font-bold text-[#9f968a] mb-1">Observação:</label>
                        <textarea id="observacao"  className="w-full rounded-lg border" style={{ height: '125px' }}  />
                    
                    </div>
                </div>
            </div>

            
          

            <div className="mt-32 flex justify-end gap-4">
                <button className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">Cancelar</button>
                <button className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">Salvar</button>
            
            </div>
        </div>
    </div>
</div>
            <button 
              onClick={toggleModal} 
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Fechar
            </button>
            </div>
        
        
      )}
      {isbuscaraula && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
          <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
            <div className=" w-full h-full border-4 border-[#9f968a] rounded-lg">

           
   
           
                
                    <div className="mt-[200px] ml-[250px]">
                        <label htmlFor="first_name" className=" ml-6 text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a]">Escolha o nome da Aula que quer encontrar:</label>
                        <input type="text" id="first_name" className="ml-3 w-[400] mt-8 rounded-lg border py-2 px-3"/>
                    </div>
                    
                
                <div className=" mt-40  px-8 flex justify-end gap-4">
                <button onClick={buscar} className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">Cancelar</button>
                <button className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">Salvar</button>
          
                </div>
           
        
    </div>
</div>

            </div>
        
        
      )}
    </div>
    
    
    
</div>
        
       
      </div>
    </section>
    
    )
  }
  
  export default Page