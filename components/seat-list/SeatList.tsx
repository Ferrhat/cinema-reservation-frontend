"use client";

import { connect } from "react-redux";
import _ from "lodash";
import { Tooltip } from "react-tooltip";
import { useTranslations } from "next-intl";
import { RootState } from "@/lib/store";
import { setSelectedSeat } from "@/lib/features/venue/venueSlice";
import { Seat } from "@/types/seat";
import { Screening } from "@/types/screening";

const SeatList = ({ seats, setSelectedSeat, screenings, selectedScreeningId, selectedSeat}: {
  seats: Seat[];
  setSelectedSeat: (seat: string) => void;
  screenings: Screening[];
  selectedScreeningId: number | null;
  selectedSeat: string | null;
}) => {
  const t = useTranslations('SeatList');

  const sortedSeats = [...seats].sort((a, b) => {
    if (a.row !== b.row) {
      return a.row - b.row;
    }
    if (a.side !== b.side) {
      return a.side === 'LEFT' ? -1 : 1;
    }
    return a.side === 'LEFT' ? a.seatNo - b.seatNo : b.seatNo - a.seatNo;
  });

  const groupedSeats = _.groupBy(sortedSeats, 'row');

  const checkIfAvailable = (seat: Seat) => {
    return seat.available;
  }

  const checkIfReserved = (seat: Seat) => {
    const screening = screenings.find(screening => screening.id === selectedScreeningId);
    if (!screening) {
      return false;
    }
    return screening.reserved.includes(`${seat.row}${seat.side}${seat.seatNo}`);
  }

  const checkIfSelected = (seat: Seat) => {
    return selectedSeat === `${seat.row}${seat.side}${seat.seatNo}`;
  }

  const getTooltipContent = (seat: Seat) => {
    if (checkIfReserved(seat)) {
      return t("reserved");
    }
    if (!checkIfAvailable(seat)) {
      return t("unavailable");
    }
    return '';
  }

  return (
    <div className="space-y-2">
      {Object.entries(groupedSeats).map(([rowNumber, row], index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="w-8 text-center bg-gray-200 p-2 rounded">{rowNumber}</div>
          {row.map((seat, seatIndex) => (
            <div
              data-tooltip-id="seat-tooltip"
              data-tooltip-content={getTooltipContent(seat)}
              data-tooltip-place="top"
              key={seatIndex}
              className={`w-6 h-6 rounded cursor-pointer flex items-center justify-center ${checkIfSelected(seat) ? 'bg-yellow-500' : checkIfAvailable(seat) && !checkIfReserved(seat) ? 'bg-green-500' : 'bg-red-500'}`}
              onClick={() => {
                if (checkIfAvailable(seat) && !checkIfReserved(seat)) {
                  setSelectedSeat(`${seat.row}${seat.side}${seat.seatNo}`);
                }
              }}
            >
              <span className="text-white text-sm">{seat.seatNo}</span>
            </div>
          ))}
        </div>
      ))}
      <Tooltip id="seat-tooltip" />
    </div>
  );
};


const mapStateToProps = (state: RootState) => ({
  seats: state.venue.seats,
  screenings: state.venue.screenings,
  selectedScreeningId: state.venue.selectedScreeningId,
  selectedSeat: state.venue.selectedSeat,
});

const mapDispatchToProps = {
  setSelectedSeat: (seat: string) => setSelectedSeat(seat),
};

export default connect(mapStateToProps, mapDispatchToProps)(SeatList);

