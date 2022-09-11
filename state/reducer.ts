const reducer = (state: IState, action: IAction): IState => {
  const newWishlist = new Set([...state.wishlist])

  switch (action.type) {
    case 'ADD':
      newWishlist.add(action.payload)
      break
    case 'REMOVE':
      newWishlist.delete(action.payload)
      break
    case 'REPLACE':
      return {
        ...state,
        wishlist: new Set([...action.payload]),
      }
    default:
      return state
  }

  return {
    ...state,
    wishlist: newWishlist,
  }
}

export default reducer
