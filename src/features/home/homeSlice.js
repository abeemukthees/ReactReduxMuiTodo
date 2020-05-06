import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

// const dummyTodoItems = [
//   {
//     id: 1,
//     title: "Test 1",
//     status: "NOT_COMPLETED",
//   },
//   {
//     id: 2,
//     title: "Test 2",
//     status: "COMPLETED",
//   },
// ];

export const getTodoItemsFromNetwork = createAsyncThunk(
  "todos/getTodoItemsFromNetwork",
  async () => {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    return response.data;
  }
);

// export const getTodoItemsFromNetwork = () => async (dispatch) => {
//   const response = await axios.get(
//     "https://jsonplaceholder.typicode.com/todos"
//   );
//   dispatch(getTodoItems(_.mapKeys(response.data, "id")));
// };

export const todosAdapter = createEntityAdapter({
  loading: false,
});
const initialState = todosAdapter.getInitialState();

export const homeSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    updateTodoStatus: (state, { payload }) => {
      const { id, ...changes } = payload;
      todosAdapter.updateOne(state, { id, changes });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTodoItemsFromNetwork.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getTodoItemsFromNetwork.fulfilled, (state, action) => {
      todosAdapter.upsertMany(state, action.payload);
      state.loading = false;
    });
  },
});

export const { getTodoItems, updateTodoStatus } = homeSlice.actions;

//export const selectTodoItems = (state) => state.todoItems.value;

export const { selectAll: selectTodoItems } = todosAdapter.getSelectors(
  (state) => state.todos
);

export default homeSlice.reducer;
