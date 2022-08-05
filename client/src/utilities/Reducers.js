import { useData } from "../Context/DataContext";

export const reducer = (state, action) => {
  switch (action.type) {
    case "addContent":
      const newState = addItem(action.item, action.index, state);
      return newState;
    default:
      return state;
  }
};

const addItem = (item, index, state) => {
  if (state.value.length == 0) {
    return { value: [item] };
  } else {
    const newValue = state.value.map((a, i) => {
      if (i === index) {
        return item;
      } else {
        return a;
      }
    });

    return { value: newValue };
  }
};
