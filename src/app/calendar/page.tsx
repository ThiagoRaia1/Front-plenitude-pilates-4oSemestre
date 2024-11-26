"use client";
import { useEffect, useState } from "react";

// Tipagem para o estado do componente
const Calendar = ({ onDateChange }: { onDateChange: (date: Date | null) => void }) => {
  // Estado para a data atual (currentDate) - tipo Date
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Estado para os dias do mês (daysInMonth) - tipo Date[]
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);

  // Estado para o primeiro dia da semana do mês (startDay) - tipo number
  const [startDay, setStartDay] = useState<number>(0);

  // Estado para a data selecionada (selectedDate) - pode ser Date ou null
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Efeito para atualizar os dias do mês sempre que a data atual mudar
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days: Date[] = [];

    // Preencher o array days com todos os dias do mês
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    // Atualizar o estado com os dias do mês e o primeiro dia da semana
    setDaysInMonth(days);
    setStartDay(new Date(year, month, 1).getDay());
  }, [currentDate]);

  // Nomes dos dias da semana
  const dayNames = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];

  // Função para navegar para o mês anterior
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  // Função para navegar para o próximo mês
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  // Função para lidar com o clique em um dia
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date); // Passa a data para o componente pai
  };

  return (
    <div className="w-[1000px] mx-auto  border border-[#ccc] rounded-lg overflow-hidden pb-2.5 shadow-lg">
      {/* Controles de navegação para mês anterior e próximo */}
      <div className="flex justify-between items-center bg-[#b670f4] text-white p-[15px] text-[20px] font-bold">
        <button className="bg-none border-none text-white text-[15px] opacity-70 cursor-pointer" onClick={prevMonth}>&lt;</button>
        <span>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </span>
        <button className="bg-none border-none text-white text-[15px] opacity-70 cursor-pointer" onClick={nextMonth}>&gt;</button>
      </div>

      {/* Exibir os nomes dos dias da semana    day-names ,  day name*/}
      <div className="flex flex-wrap ">
        {dayNames.map((day) => (
          <div className="w-[14.28%] font-bold text-black p-2.5 border-2 border-[#f0f0f0] box-border text-center text-xs rounded-sm bg-[#f0f0f0] mb-2" key={day}>{day}</div>
        ))}
      </div>

      <div className="flex flex-wrap bg-white">
        {/* Espaços vazios no início do mês para alinhar os dias corretamente segundo days tericeiro emptydate */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={index} className="w-[14.28%] p-2.5 border-2 border-[#f0f0f0] box-border text-center text-xs opacity-70 rounded-sm"></div>
        ))}

        {/* Exibir os dias do mês */}
        {daysInMonth.map((day) => (
          <div
            key={day.toString()}  // Usar toString() para garantir a chave única
            className={`text-black border-2 border-[#f0f0f0] cursor-pointer w-[14.28%] p-2.5 box-border text-center text-xs opacity-70 rounded-sm transition-colors duration-300 hover:bg-[#f0f0f0]
            ${day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth()
                ? 'bg-[#b670f4] text-white rounded-sm text-center'
                : ''
              } ${selectedDate && day.toDateString() === selectedDate.toDateString()
                ? 'bg-[#b670f4] text-white rounded-sm text-center'
                : ''
              }`}
            onClick={() => handleDateClick(day)}
          >
            {day.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;