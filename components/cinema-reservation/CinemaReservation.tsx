"use client";

import { useEffect } from "react";
import { connect } from "react-redux";
import { useTranslations } from "next-intl";
import { fetchVenues as getVenues, fetchSeats as getSeats } from "@/lib/features/venue/venueAPI";
import { RootState } from "@/lib/store";
import VenueList from "@/components/venue-list/VenueList";
import SeatList from "@/components/seat-list/SeatList";
import ScreeningList from "@/components/screening-list/ScreeningList";
import CityList from "../city-list/CityList";
import ReservationSubmit from "./ReservationSubmit";

const CinemaReservation = ({ selectedCity, selectedVenueId, getVenues, getSeats, selectedScreeningId, selectedSeat, reverseGeocodeApiAvailable, partnerApiAvailable }: {
  selectedCity: string | null;
  selectedVenueId: number | null;
  getVenues: () => void;
  getSeats: (id: number) => void;
  selectedScreeningId: number | null;
  selectedSeat: string | null;
  reverseGeocodeApiAvailable: boolean;
  partnerApiAvailable: boolean;
}) => {
    useEffect(() => {
        getVenues();
    }, [getVenues]);
    useEffect(() => {
        if (selectedVenueId) {
            getSeats(selectedVenueId);
        }
    }, [getSeats, selectedVenueId]);

    const t = useTranslations('CinemaReservation');

  if (!partnerApiAvailable) {
    return <div>{`${t("partnerApiUnavailable")}`}</div>;
  }

  return (
    <>
    {!!reverseGeocodeApiAvailable && (<CityList />)}
    {(!!selectedCity || !reverseGeocodeApiAvailable) && (<VenueList />)}
    {!!selectedVenueId && (<ScreeningList />)}
    {!!selectedScreeningId && (<SeatList />)}
    {!!selectedSeat && <div><p><ReservationSubmit /></p></div>}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedCity: state.venue.selectedCity,
  selectedVenueId: state.venue.selectedVenueId,
  selectedScreeningId: state.venue.selectedScreeningId,
  selectedSeat: state.venue.selectedSeat,
  reverseGeocodeApiAvailable: state.venue.reverseGeocodeApiAvailable,
  partnerApiAvailable: state.venue.partnerApiAvailable,
});

const mapDispatchToProps = {
    getVenues,
    getSeats,
};

export default connect(mapStateToProps, mapDispatchToProps)(CinemaReservation);
