import {createReducer} from '@reduxjs/toolkit';
import {requireAuthorization, requireLogout} from '../action';
import {UserProcess} from '../../types/state';
import {AuthorizationStatus} from '../../const';

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
};

const userProcess = createReducer(initialState, (builder) => {
  builder
    // requireAuthorization дает под капотом requireAuthorization.toString() - это тип требуемого действия
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(requireLogout, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
    });
});

export {userProcess};
