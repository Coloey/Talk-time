//import { message } from 'antd';
//import { createSlice } from '@reduxjs/toolkit';
export const initialState = { messageCount: 0 }

export const reducer = (state, action) => {
  switch (action.type) {
    case 'initValue':
      console.log(action.payload, 'action')
      return { ...state, messageCount: action.payload };
    case 'increment':
      return { ...state, messageCount: state.messageCoun + 1 };
    default:
      return state;
  }
}

// 为每个 case reducer 函数生成 Action creators
//export const { increment, decrement, incrementByAmount } = messageCounterSlice.actions;
