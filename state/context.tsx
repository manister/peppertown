import { createContext, useContext, useEffect, useReducer } from 'react'
import createActions from './actions'
import initialState from './initialState'
import reducer from './reducer'

type Props = {
  children: React.ReactNode
}

const Hook = (): IAppContext => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    //on first load
    let wishlistArr = []
    try {
      wishlistArr = JSON.parse(localStorage.getItem('wishlist') ?? '[]') as string[]
      actions.hydrate(wishlistArr)
    } catch (e) {
      console.error(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    //when the wishlist updates, store it
    const wishlistJSON = JSON.stringify([...state.wishlist])
    localStorage.setItem('wishlist', wishlistJSON)
  }, [state])

  const actions = createActions(dispatch)

  return {
    state,
    actions,
  }
}

const AppContext = createContext({} as IAppContext)

export const AppWrapper = ({ children }: Props): JSX.Element => {
  return <AppContext.Provider value={Hook()}>{children}</AppContext.Provider>
}

export const useGlobalState = (): IAppContext => useContext(AppContext)
