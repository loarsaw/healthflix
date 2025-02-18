import { createSlice } from '@reduxjs/toolkit';

export const asyncSlice = createSlice({
    name: 'counter',
    initialState: {
        // any page has this set as false by default
        loading: false,
    },
    reducers: {

        on: (state) => {
            state.loading = true;
        },
        off: (state) => {
            state.loading = false;
        },
    },
});

export const { on, off } = asyncSlice.actions;


export default asyncSlice.reducer;