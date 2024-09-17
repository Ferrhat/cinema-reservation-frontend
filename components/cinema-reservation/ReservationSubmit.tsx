import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslations } from 'next-intl';
import { RootState } from "@/lib/store";
import { makeReservation } from "@/lib/features/venue/venueAPI";
import Alert, { AlertType } from '@/components/alerts/Alerts';

const ReservationSubmit = ({ makeReservation, selectedSeat, selectedScreeningId, selectedVenueId, alert }: {
    makeReservation: (selectedVenueId: number | null, selectedScreeningId: number | null, email: string, selectedSeat: string | null) => void;
    selectedSeat: string | null;
    selectedScreeningId: number | null;
    selectedVenueId: number | null;
    alert: { type: AlertType, message: string } | null;
  }) => {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        makeReservation(selectedVenueId, selectedScreeningId, email, selectedSeat);
    };

    const t = useTranslations('CinemaReservation');

    return (
        <div className="p-4">
          {alert && <Alert type={alert.type} message={alert.message} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-gray-700">{t("email")}:</span>
              <input type="email" value={email} onChange={handleEmailChange} className="mt-1 block w-full rounded-md border-2 border-gray-800 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500" />
            </label>
            <button type="submit" className="px-4 py-2 rounded shadow bg-green-500 text-white hover:bg-green-600">{t("makeReservation")}</button>
          </form>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
  selectedSeat: state.venue.selectedSeat,
  selectedVenueId: state.venue.selectedVenueId,
  selectedScreeningId: state.venue.selectedScreeningId,
  alert: state.venue.alert as { type: AlertType, message: string } | null, // Add type assertion
});


const mapDispatchToProps = {
  makeReservation: (selectedVenueId: number | null, selectedScreeningId: number | null, email: string, selectedSeat: string | null) => makeReservation({selectedVenueId, selectedScreeningId, email, selectedSeat}),
};

export default connect(mapStateToProps, mapDispatchToProps)(ReservationSubmit);
