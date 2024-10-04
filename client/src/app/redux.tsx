//setup for next.js and localstorage
//if user came back to page data is stored -- redux-persist
import { useEffect, useRef } from "react"; //hook to create a persistent reference that does NOT change across renders
import {
  combineReducers,
  configureStore, //simplify creation of redux store with good defaults
} from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider, //wraps app and makes redux store available to all components
} from "react-redux";
import globalReducer from "@/state";
import authReducer from "@/state/authSlice";
import { api } from "@/state/api";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"; //store variable in localstorage to prevent from resetting when refreshed
import { PersistGate } from "redux-persist/integration/react"; //delays rendering until the persisted state is loaded
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/* REDUX PERSISTENCE */
//setup local storage state
const createNoopStorage = () => {
  // prevent error when trying to use localStorage ont he server
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

const persistConfig = {
  key: "root",
  storage, //localStorage
  whitelist: ["global", "auth"], //reducer names whose state should be PERSISTED
};
const rootReducer = combineReducers({
  auth: authReducer,
  global: globalReducer, //states
  [api.reducerPath]: api.reducer, //api calls
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* REDUX STORE */
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER */
export default function StoreProvider({
  // wraps app and provides Redux store and persistor to the app
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(); // create a persistent referenece to the store across re-renders

  if (!storeRef.current) {
    storeRef.current = makeStore(); //if not created, create the store
    setupListeners(storeRef.current.dispatch); // automatic re-fetching of data
  }
  const persistor = persistStore(storeRef.current); // persissting of the data of store

  return (
    <Provider store={storeRef.current}>
      {/*avaliable for rest of the app*/}
      <PersistGate loading={null} persistor={persistor}>
        {/*delay rendering of children till persisted state stored*/}
        {children}
      </PersistGate>
    </Provider>
  );
}
