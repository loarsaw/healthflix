import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
    user: {
        email: string | null;
    };
};

const initialState: UserState = {
    user: {
        email: null,
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<{ email: string | null }>) => {
            state.user.email = action.payload.email;
        },
    },
});

export const { addUser } = userSlice.actions;

export default userSlice.reducer;
