"use client";

import { connect } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import _ from "lodash";
import { DateTime } from "luxon";
import { Tooltip } from "react-tooltip";
import { useTranslations, useLocale } from "next-intl";
import { setSelectedScreening } from "@/lib/features/venue/venueSlice";
import { fetchScreenings as getScreenings } from "@/lib/features/venue/venueAPI";
import Calendar from "@/components/calendar/Calendar";
import { Seat } from "@/types/seat";
import { Screening } from "@/types/screening";

const ScreeningList = ({ getScreenings, screenings, selectedVenueId, setSelectedScreening, seats, selectedScreeningId }: {
  screenings: Screening[];
  getScreenings: (id: number) => void;
  selectedVenueId: number | null;
  setSelectedScreening: (id: number | null) => void;
  seats: Seat[];
  selectedScreeningId: number | null;
}) => {
  const [screeningsByDatesAndMovies, setScreeningsByDatesAndMovies] = useState({});
  const [date, setDate] = useState(new Date());

  const t = useTranslations('ScreeningList');
  const locale = useLocale();

  useEffect(() => {
    if (selectedVenueId) {
      getScreenings(selectedVenueId);
    }
  }, [getScreenings, selectedVenueId]);

  useEffect(() => {
    if (screenings.length > 0) {
      setScreeningsByDatesAndMovies(getScreeningsByDatesAndMovies());
    }
  }, [screenings]);

  useEffect(() => {
    setSelectedScreening(null);
  }, [date]);

  const getScreeningsByDatesAndMovies = () => {
    const screeningsByDatesAndMovies: { [date: string]: { movies: { title: string, screenings: Screening[] }[] } } = {};
    screenings.forEach((screening) => {
      const date = DateTime.fromSeconds(screening.startEpochSeconds);
      if (date > DateTime.now()) {
        if (!screeningsByDatesAndMovies[date.toISODate()]) {
          screeningsByDatesAndMovies[date.toISODate()] = {
            movies: [
              {
                title: screening.hu,
                screenings: [screening]
              }
            ]
          };
        } else {
          const movieIndex = _.findIndex(screeningsByDatesAndMovies[date.toISODate()].movies, { title: screening.hu });
          if (movieIndex === -1) {
            screeningsByDatesAndMovies[date.toISODate()].movies.push({
              title: screening.hu,
              screenings: [screening]
            });
          } else {
            screeningsByDatesAndMovies[date.toISODate()].movies[movieIndex].screenings.push(screening);
          }
        }
      }
    });
    return screeningsByDatesAndMovies;
  };

  const hasAvailableSeats = (screening: Screening) => {
    return _.difference(seats.map(seat => (`${seat.row}${seat.side}${seat.seatNo}`)), screening.reserved).length > 0;
  }

  const isReservable = (screening: Screening) => {
    const screeningStart = DateTime.fromSeconds(screening.startEpochSeconds);
    const today = DateTime.now();
    const startOfWeek = screeningStart.startOf('week');
    return today >= startOfWeek && today < screeningStart.minus({ minutes: 10 });
  }

  const isSelectedScreening = (screening: Screening) => {
    return screening.id === selectedScreeningId;
  }

  const getTooltipContent = (screening: Screening) => {
    if (!hasAvailableSeats(screening)) {
      return t('noAvailableSeats');
    }
    if (!isReservable(screening)) {
      return t('reservationNotStarted');
    }
    return "";
  }

  const today = DateTime.now().toISODate();
  const selectedDate = DateTime.fromJSDate(date).toISODate();
  const screeningsBySelectedDate: { movies: { title: string, screenings: Screening[] }[] } = _.get(screeningsByDatesAndMovies, _.defaultTo(selectedDate, today), { movies: [] });

  return (
    <>
      <div className="mt-2 uppercase tracking-wide text-sm custom-green font-semibold">{t('selectDate')}</div>
      <Calendar date={date} setDate={setDate} />
      <div className="space-y-4">
        {screeningsBySelectedDate.movies.map((movie) => (
          <div key={movie.title} className="p-4 border rounded shadow">
            <h3 className="text-2xl font-bold mb-2">{_.get(movie.screenings, `[0].${locale}`, movie.title)}</h3>
            <ul className="space-y-2">
              {movie.screenings.map((screening: Screening) => (
                <li key={screening.id}>
                  <button
                    data-tooltip-id="screening-tooltip"
                    data-tooltip-content={getTooltipContent(screening)}
                    data-tooltip-place="right"
                    disabled={!hasAvailableSeats(screening) || !isReservable(screening)}
                    onClick={() => setSelectedScreening(screening.id)}
                    className={`px-4 py-2 rounded shadow ${isSelectedScreening(screening) ? 'bg-yellow-500' : !hasAvailableSeats(screening) || !isReservable(screening) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                  >
                    {DateTime.fromSeconds(screening.startEpochSeconds).setZone('Europe/Budapest').toFormat('HH:mm')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Tooltip id="screening-tooltip" />
    </>
  );
};


const mapStateToProps = (state: RootState) => ({
  selectedVenueId: state.venue.selectedVenueId,
  screenings: state.venue.screenings,
  seats: state.venue.seats,
  selectedScreeningId: state.venue.selectedScreeningId,
});

const mapDispatchToProps = {
  getScreenings: (id: number) => getScreenings(id),
  setSelectedScreening: (id: number | null) => setSelectedScreening(id),
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningList);
