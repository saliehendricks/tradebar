import { ADD_TO_CART } from "../actions/action-types/cart-action-constants";

const shopState = { products: [{}], cartItems: [{}], cartTotal: 0 };
const cartReducer = (state = shopState, action) => {
  if (action.type === ADD_TO_CART) {
    let addedItem = state.items.find((item) => item.id === action.id);
    //check if the action id exists in the addedItems
    let existed_item = state.addedItems.find((item) => action.id === item.id);
    if (existed_item) {
      addedItem.quantity += 1;
      return {
        ...state,
        total: state.total + addedItem.price,
      };
    } else {
      addedItem.quantity = 1;
      //calculating the total
      let newTotal = state.total + addedItem.price;

      return {
        ...state,
        addedItems: [...state.addedItems, addedItem],
        total: newTotal,
      };
    }
  } else {
    return state;
  }
};
export default cartReducer;
