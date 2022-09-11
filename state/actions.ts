import { Dispatch } from 'react'

const createActions = (dispatch: Dispatch<IAction>): IAppContext['actions'] => {
  return {
    //all actions here
    addToWishlist: (handle: string): void => {
      dispatch({ type: 'ADD', payload: handle })
    },
    removeFromWishlist: (handle: string): void => {
      dispatch({ type: 'REMOVE', payload: handle })
    },
    hydrate: (handles: string[]): void => {
      dispatch({ type: 'REPLACE', payload: handles })
    },
  }
}

export default createActions
