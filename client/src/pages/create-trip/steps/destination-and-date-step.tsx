import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { Button } from "../../../components/button";
import { useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, format } from "date-fns";

interface DestinationAndDateStepProps {
  isGuestInputOpen: boolean
  openGuestInput: () => void
  closeGuestInput: () => void
  enabledInput: string
  disabledInput: string
}

export function DestinationAndDateStep({ 
  closeGuestInput,
  isGuestInputOpen,
  openGuestInput,
  enabledInput,
  disabledInput,
 }: DestinationAndDateStepProps) {

  const initialRange = undefined;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialRange);

  useEffect(() => {
    console.log(dateRange);
  },[dateRange])

  function openDatePicker() {
    return setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false);
  }

  const displayDate = 
  dateRange &&
  dateRange.from ?
  `${format(dateRange.from, 'dd/MMM')}
  ${dateRange.to ? `até ${format(dateRange.to, 'dd/MMM')}` : ''}` 
  : 'Quando?';

  return (
    <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-5">
      <div className='flex items-center gap-2 flex-1'>
        <MapPin className="size-5 text-zinc-400" />
        <input required disabled={isGuestInputOpen} type="text" placeholder="Para onde você vai?"
        className={isGuestInputOpen ? disabledInput + ' flex-1' : enabledInput + ' flex-1'}/>
      </div>

      <button onClick={openDatePicker} disabled={isGuestInputOpen} className='flex items-center gap-2 text-left text-zinc-400'>
        <Calendar className="size-5 text-zinc-400" />
        <span className={isGuestInputOpen ? disabledInput  : enabledInput } >
          {displayDate}
        </span>
      </button>

      {/* Divider */}
      <div className='w-px h-6 bg-zinc-800'></div>

      {/* Button State */}
      {isGuestInputOpen ? (
        <Button onClick={closeGuestInput} type="button" variant="secondary" size="small">
          Alterar local/data
          <Settings2 className="size-5 text-zinc-200" />
        </Button>
      ) : (
        <Button onClick={openGuestInput} type="submit" variant="primary" size="small">
          Continuar
          <ArrowRight className="size-5 text-lime-950" />
        </Button>
      )}

      {/* Date Picker Modal*/}
      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
        {/* CARD */}
          <div className='rounded-xl px-6 py-5 shadow-shape bg-zinc-900 space-y-5'>

            {/* Title */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between gap-2'>
                <h2 className='text-lg font-semibold'>Selecione a data</h2>
                <button>
                  <X onClick={closeDatePicker} className='size-5 text-zinc-400'/>
                </button>
              </div>
            </div>

            {/* Picker */}
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              showOutsideDays
              fixedWeeks
            />

          </div>

        </div>
      )}

    </div>
  )
}