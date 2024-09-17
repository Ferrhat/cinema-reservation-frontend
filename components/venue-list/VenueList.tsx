"use client";

import { connect } from "react-redux";
import { setSelectedVenue } from "@/lib/features/venue/venueSlice";
import { RootState } from "@/lib/store";
import { useLocale, useTranslations} from 'next-intl';
import { Venue } from "@/types/venue";
import _ from "lodash";

const VenueList = ({ setSelectedVenue, venues, selectedCity, reverseGeocodeApiAvailable }: {
  selectedCity: string | null;
  setSelectedVenue: (id: number) => void;
  venues: Venue[];
  reverseGeocodeApiAvailable: boolean;
}) => {

  const t = useTranslations('VenueList');
  const locale = useLocale();

  let filteredVenues = [];
  if (!reverseGeocodeApiAvailable) {
    filteredVenues = venues;
  } else {
    filteredVenues = venues.filter(venue => venue.city === selectedCity);
  }

  return (
    <>
      <div className="mt-2 uppercase tracking-wide text-sm custom-green font-semibold">{t('selectVenue')}</div>
      <div className="mt-2">
        <select id="venue-selector" className="block w-full py-3 px-4 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" onChange={(e) => setSelectedVenue(parseInt(e.target.value))}>
          <option key={0} value={0}>{t('selectVenueOptionDefault')}</option>
          {filteredVenues.map((venue: Venue) => (
            <option key={venue.id} value={venue.id}>{_.get(venue, locale, venue.hu)}</option>
          ))}
        </select>
      </div>
    </>
  );
};


const mapStateToProps = (state: RootState) => ({
  selectedCity: state.venue.selectedCity,
  venues: state.venue.venues,
  reverseGeocodeApiAvailable: state.venue.reverseGeocodeApiAvailable,
});

const mapDispatchToProps = {
  setSelectedVenue,
};

export default connect(mapStateToProps, mapDispatchToProps)(VenueList);

