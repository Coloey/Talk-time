import { createStore } from 'redux'
import { reducer, initialState } from './features/createSlice'
export const store = createStore(reducer,initialState)