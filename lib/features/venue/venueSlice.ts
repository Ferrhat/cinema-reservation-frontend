import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { Venue } from '@/types/venue';
import { Seat } from '@/types/seat';
import { Screening } from '@/types/screening';
import { fetchVenues, fetchSeats, fetchScreenings, makeReservation } from './venueAPI';

export interface Alert {
  type: string,
  message: string,
}

export interface VenueState {
  selectedCity: string | null,
  selectedVenueId: number | null,
  selectedScreeningId: number | null,
  selectedSeat: string | null,
  venues: Venue[],
  seats: Seat[],
  screenings: Screening[],
  reverseGeocodeApiAvailable: boolean,
  partnerApiAvailable: boolean,
  alert: Alert | null,
}

const initialState: VenueState = {
  selectedCity: null,
  selectedVenueId: null,
  selectedScreeningId: null,
  selectedSeat: null,
  venues: [],
  seats: [],
  screenings: [],
  reverseGeocodeApiAvailable: true,
  partnerApiAvailable: true,
  alert: null,
}

export const venueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
      state.selectedVenueId = null;
      state.selectedScreeningId = null;
      state.selectedSeat = null;
      state.alert = null;
    },
    setSelectedVenue: (state, action) => {
      state.selectedVenueId = action.payload;
      state.selectedScreeningId = null;
      state.selectedSeat = null;
      state.alert = null;
    },
    setSelectedScreening: (state, action) => {
      state.selectedScreeningId = action.payload;
      state.selectedSeat = null;
      state.alert = null;
    },
    setSelectedSeat: (state, action) => {
      state.selectedSeat = action.payload;
      state.alert = null;
    },
    setReverseGeocodeApiAvailable: (state, action) => {
      state.reverseGeocodeApiAvailable = action.payload;
    },
    setAlert: (state, action) => {
      state.alert = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVenues.fulfilled, (state, action) => {
      state.venues = action.payload;
    });
    builder.addCase(fetchSeats.fulfilled, (state, action) => {
      state.seats = action.payload;
    });
    builder.addCase(fetchScreenings.fulfilled, (state, action) => {
      state.screenings = action.payload;
    });
    builder.addCase(makeReservation.fulfilled, (state, action) => {
      console.log("Reservation made", action.payload);
      state.alert = { type: "success", message: "Reservation made" };
    });
    builder.addCase(makeReservation.rejected, (state, action) => {
      if (action.payload) {
        const { status, data } = action.payload as { status: number, data: number };
        if (status >= 400 && status < 500) {
          switch (data) {
            case 200:
              state.alert = { type: "error", message: "Request body format error" };
              break;
            case 300:
              state.alert = { type: "error", message: "Venue or screening not found" };
              break;
            case 301:
              state.alert = { type: "error", message: "Seat not found" };
              break;
            case 302:
              state.alert = { type: "error", message: "Seat not available" };
              break;
            case 400:
              state.alert = { type: "error", message: "Reservation cannot be done at this moment" };
              break;
            default:
              state.alert = { type: "error", message: "Unknown error" };
              break;
          }
        } else if (status >= 500 && status < 600) {
          state.alert = { type: "error", message: "Internal error in the Partner's system" };
        } else {
          state.alert = { type: "error", message: "Unknown error" };
        }
      }
    });
    builder.addCase(fetchVenues.rejected, (state) => {
      state.partnerApiAvailable = false;
    });
    builder.addCase(fetchSeats.rejected, (state) => {
      state.partnerApiAvailable = false;
    });
    builder.addCase(fetchScreenings.rejected, (state) => {
      state.partnerApiAvailable = false;
    });

  }
});

export const selectVenues = (state: RootState) => state.venue.venues;
export const { setSelectedCity, setSelectedVenue, setSelectedScreening, setSelectedSeat, setReverseGeocodeApiAvailable, setAlert } = venueSlice.actions;

export default venueSlice.reducer
