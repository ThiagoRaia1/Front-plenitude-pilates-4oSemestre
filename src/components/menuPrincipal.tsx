import { useAuth } from "@/context/auth";

const MenuPrincipal = () => {
    const { usuario, isAuthenticated, logout } = useAuth();
    return (
        <div className="grid md:h-screen md:grid-cols-[350px_1fr]" >
            <div className="flex flex-col items-center justify-center bg-[#89b6d5]">
                <div className="max-w-lg text-center md:px-10 md:py-24 lg:py-32">
                    <img alt="" src="/usuario.png" className="relative inline-block w-100 h-100" />
                    <div className="mx-auto w-full mt-12 mb-4 pb-4 ">
                        <div className="relative">
                            <h1
                                className="font-bold font-spartan text-[30px] text-white">
                                Usuario: {usuario?.nome}
                            </h1>
                            <a href="/agenda">
                                <button
                                    className="font-bold font-spartan text-[40px] mb-4 block w-full text-[#ffffff] border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                                    AGENDA
                                </button>
                            </a>
                        </div>
                        <div className="relative">
                            <a href="/alunos">
                                <button
                                    className="font-bold font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff] border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                                    ALUNOS
                                </button>
                            </a>
                        </div>
                        <div className="relative">
                            <a href="/equipe">
                                <button
                                    className="font-bold font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                                    EQUIPE
                                </button>
                            </a>
                        </div>
                        <div className="relative">
                            <a href="/financeiro">
                                <button
                                    className="font-bold px-18 font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                                    FINANCEIRO
                                </button>
                            </a>
                        </div>
                        <div className="relative">
                            <a href="/login">
                                <button
                                    onClick={logout}
                                    className="font-bold px-18 font-spartan text-[40px] mb-4 block  w-full  text-[#ffffff]  border-2 border-transparent focus:outline-none hover:bg-white hover:bg-opacity-50 rounded-sm">
                                    LOGOUT
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MenuPrincipal;