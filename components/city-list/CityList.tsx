"use client";

import { connect } from "react-redux";
import { setSelectedCity } from "@/lib/features/venue/venueSlice";
import { RootState } from "@/lib/store";
import {useTranslations} from 'next-intl';
import _ from 'lodash';
import { Venue } from "@/types/venue";

const CityList = ({ setSelectedCity, venues }: {
  setSelectedCity: (city: string) => void;
  venues: Venue[];
}) => {

  const t = useTranslations('CityList');
  const cities = _.uniq(venues.map((venue: Venue) => venue.city));

  return (
    <>
      <div className="mt-2 uppercase tracking-wide text-sm custom-green font-semibold">{t('selectCity')}</div>
      <div className="mt-2">
        <select id="city-selector" className="bg-gray-250 block w-full py-3 px-4 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" onChange={(e) => setSelectedCity(e.target.value)}>
          <option key={0} value={""}>{t('selectCityOptionDefault')}</option>
          {cities.map((city: string | undefined, i: number) => (
            <option key={i} value={city}>{city}</option>
          ))}
        </select>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  venues: state.venue.venues,
});

const mapDispatchToProps = {
  setSelectedCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityList);

