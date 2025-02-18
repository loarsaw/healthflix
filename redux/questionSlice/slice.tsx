import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionState {
  questions: Question[];
  alreadyAttempted: string[]; 
}

const initialState: QuestionState = {
  questions: [],
  alreadyAttempted: [],
};

export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addSet(state, action: PayloadAction<Question[]>) {
      state.questions = action.payload;
    },
    addAttempted(state, action: PayloadAction<string[]>) {
      state.alreadyAttempted = action.payload;
    },
  },
});

export const { addSet, addAttempted } = questionSlice.actions;

export default questionSlice.reducer;
