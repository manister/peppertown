import { createContext, Dispatch, useContext, useReducer } from 'react'

interface IState {
  count: number
}

interface IAction {
  type: string
  payload?: number
}

interface IAppContext {
  state: IState
  dispatch: Dispatch<IAction>
}

const reducer = (state: IState, { type, payload }: IAction): IState => {
  switch (type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      }
    case 'SET_COUNT':
      return {
        ...state,
        count: payload ?? state.count,
      }
    default:
      return state
  }
}

const initialState: IState = {
  count: 0,
}

const AppContext = createContext({ state: initialState } as IAppContext)

interface Props {
  children: React.ReactNode
}

export const AppWrapper = ({ children }: Props): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export const useGlobalState = (): IAppContext => useContext(AppContext)
