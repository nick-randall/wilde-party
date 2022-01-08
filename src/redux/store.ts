import { AnyAction, applyMiddleware, createStore } from "@reduxjs/toolkit";
import { stateReducer } from "./stateReducer";
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'


const composedEnhancer = composeWithDevTools(applyMiddleware<ThunkDispatch<any, undefined, AnyAction>>(thunkMiddleware))

export const store = createStore(stateReducer, composedEnhancer);

  // // Infer the `RootState` and `AppDispatch` types from the store itself
  export type RootState = ReturnType<typeof store.getState>;
  // // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
  export type AppDispatch = ThunkDispatch<any, undefined, AnyAction>;

export default store;
