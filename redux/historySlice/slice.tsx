import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type quesString = {
    question: string; options: string[]; correctAnswer: string;
}

type HistoryItem = {
    id: string;
    questions: quesString[],
    score: number,
    attemptedOn: string;
};

type HistoryState = {
    history: HistoryItem[];
};

const initialState: HistoryState = {
    history: [],
};

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        addToHistory: (state, action: PayloadAction<HistoryItem>) => {
            state.history = [...state.history, action.payload];
        },

    },
});

export const { addToHistory } = historySlice.actions;


export default historySlice.reducer;