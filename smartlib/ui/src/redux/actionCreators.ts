import { AnyAction, ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "./store";

type MultiAction = ThunkAction<void, RootState, unknown, AnyAction>;

export const multiAction = (actions: AnyAction[]): MultiAction => {
  return (dispatch: ThunkDispatch<RootState, unknown, AnyAction>) => {
    actions.forEach((action) => {
      dispatch(action);
    });
  };
};
