"use client"
import { useState } from "react";

const Page = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[isbuscarfuncionario, setisbuscarfuncionario] = useState(false)
  const cadFunc = () => {
    setIsModalOpen(!isModalOpen);
  }
  const buscar = () => {
    setisbuscarfuncionario(!isbuscarfuncionario);
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
  <button  onClick={cadFunc} className=" bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
  <button  onClick={buscar} className=" bg-blue-500 text-white rounded hover:bg-blue-600">Buscar Aulas</button>
  </div>


<div >
<table className="w-full border-collapse border border-blue-500 max-w-xl mt-16 mx-auto">
  <thead>
    <tr className="bg-blue-500 text-white">
      <th className="py-2 px-4 text-left">id</th>
      <th className="py-2 px-4 text-left">Cpf</th>
      <th className="py-2 px-4 text-left">status</th>
      <th className="py-2 px-4 text-left">Ultima Alteracao</th>
      <th className="py-2 px-4 text-left">Data ultima Alteracao</th>
      <th className="py-2 px-4 text-left">numero Rua</th>
      <th className="py-2 px-4 text-left">numero Casa</th>
      <th className="py-2 px-4 text-left">cep</th>
      <th className="py-2 px-4 text-left">bairro</th>
      <th className="py-2 px-4 text-left">cidade</th>

    </tr>
  </thead>
  <tbody>
    <tr className="bg-white border-b border-blue-500">
      <td className="py-2 px-4">John Doe</td>
      <td className="py-2 px-4">25</td>
      <td className="py-2 px-4">New York</td>
    </tr>
    <tr className="bg-white border-b border-blue-500">
      <td className="py-2 px-4">Jane Smith</td>
      <td className="py-2 px-4">30</td>
      <td className="py-2 px-4">Los Angeles</td>
    </tr>
    <tr className="bg-white border-b border-blue-500">
      <td className="py-2 px-4">Bob Johnson</td>
      <td className="py-2 px-4">40</td>
      <td className="py-2 px-4">Chicago</td>
    </tr>
  </tbody>
</table>
     
        
  {isModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
          <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
            <div className=" w-full h-full p-8 border-4 border-[#9f968a] rounded-lg">

    <div className="w-full  mx-auto mt-3 ">
   
            <div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Nome:</label>
                        <input type="text" id="first_name" className="w-80 rounded-lg border py-2 px-3"/>
                    </div>
                    <div>
                    <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Função:</label>
              <input 
                type="text" 
                id="last_name" 
                className="w-80 rounded-lg border py-2 px-3 " 
              />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div >
                        <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Data de nascimento: dd/mm/yyyy</label>
                        <input type="text" id="dia" className="w-[50px] rounded-lg border py-2 px-[8px] mr-2 "/>
                        <input type="text" id="mes" className=" w-[70px] rounded-lg border py-2 mr-2 px-[8px] "/>
                        <input type="text" id="ano" className=" w-[100px] rounded-lg border py-2 mr-2 px-[8px]"/>
                    </div>
                    <div>
                    <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Rua:</label>
              <input 
                type="text" 
                id="last_name" 
                className="w-80 rounded-lg border py-2 px-3 " 
              />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Telefone:</label>
                        <input type="text" id="first_name" className="w-80 rounded-lg border py-2 px-3"/>
                    </div>
                    <div>
                    <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Bairro:</label>
              <input 
                type="text" 
                id="last_name" 
                className="w-80 rounded-lg border py-2 px-3 " 
              />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Cep:</label>
                        <input type="text" id="first_name" className="w-80 rounded-lg border py-2 px-3"/>
                    </div>
                    <div>
                    <label htmlFor="last_name" className="block text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Cidade:</label>
              <input 
                type="text" 
                id="last_name" 
                className="w-80 rounded-lg border py-2 px-3 " 
              />
                    </div>
                </div>
                
                    <div className="mt-4">
                        <label htmlFor="first_name" className=" text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a] mb-1">Senha:</label>
                        <input type="text" id="first_name" className="w-80 rounded-lg border py-2 px-3"/>
                    </div>
                    
            

                


            </div>

            
          

            <div className=" flex justify-end gap-4">
                <button className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">Cancelar</button>
                <button className="bg-white text-[24px] font-[Garet] font-sans font-bold  text-[#9f968a] px-4 py-2 rounded-lg hover:bg-teal-700  ">Salvar</button>
            
            </div>
        </div>
    </div>
</div>
            <button 
              onClick={cadFunc} 
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Fechar
            </button>
            </div>
        
        
      )}
        {isbuscarfuncionario && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
          <div className="bg-[#ececec] rounded-lg w-[1000px] h-[600px]  border-4 border-[#ececec] p-6  ">
            <div className=" w-full h-full border-4 border-[#9f968a] rounded-lg">

           
   
           
                
                    <div className="mt-[200px] ml-[250px]">
                        <label htmlFor="first_name" className="  text-[18px] font-[Garet] font-sans font-bold block text-[#9f968a]">Escolha o nome do Funcionario que quer encontrar:</label>
                        <input type="text" id="first_name" className="ml-4 w-[400] mt-8 rounded-lg border py-2 px-3"/>
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