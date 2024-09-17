import { createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios';
import { Venue } from '@/types/venue';
import { City, findNearestCity, loadCities } from '@/utils/reverseGeocode';
import { setReverseGeocodeApiAvailable } from './venueSlice';

/*
// use this function, if the offline reverse geocoding is innacurate
const getCityFromApi = async (latitude: number, longitude: number) => {
  const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=hu`);
  return response.data.city;
}
*/

const getCityFromLocal = async (latitude: number, longitude: number, cities: City[]) => {
  const city = await findNearestCity(latitude, longitude, cities);
  return city ? city.name : null;
};

export const fetchVenues = createAsyncThunk(
  'venue/fetchVenues',
  async (_, { dispatch }) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_PARTNER_ROOT_API_URL}/api/v1/venues`);
    const cities = await loadCities();
    const venues = await Promise.all(response.data.map(async (venue: Venue) => {
      venue.city = await getCityFromLocal(venue.lat, venue.lon, cities) ?? undefined;
      return venue;
    })).catch(() => {
      dispatch(setReverseGeocodeApiAvailable(false));
      console.log("Reverse geocode API is not available");
      return response.data;
    });
    return venues;
  }
);

export const fetchSeats = createAsyncThunk(
  'venue/fetchSeats',
  async (id: number) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_PARTNER_ROOT_API_URL}/api/v1/venue/${id}/seats`);
    return response.data;
  }
);

export const fetchScreenings = createAsyncThunk(
  'venue/fetchScreenings',
  async (id: number) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_PARTNER_ROOT_API_URL}/api/v1/venue/${id}/screenings`);
    return response.data;
  }
);

export const makeReservation = createAsyncThunk(
  'venue/makeReservation',
  async (
    { selectedVenueId, selectedScreeningId, email, selectedSeat }:
    { selectedVenueId: number | null, selectedScreeningId: number | null, email: string, selectedSeat: string | null },
    { rejectWithValue }
  ) => {
    try {
      if (selectedVenueId && selectedScreeningId && selectedSeat && email) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_PARTNER_ROOT_API_URL}/api/v1/venue/${selectedVenueId}/screening/${selectedScreeningId}/reserve`, {
          partnerId: "Simple",
          userEmail: email,
          seat: selectedSeat,
        });
        return response.data;
      }
    } catch (err) {
      if (err && (err as AxiosError).response) {
        const axiosError = err as AxiosError;
        return rejectWithValue({
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });
      }
      throw err;
    }
  }
);
