import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio",
  initialState: {
    isConnected: false,
    socket:null
  },
  reducers: {
    setSocketConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setSocket:(state,action)=>{
        state.socket=action.payload
    }
  },
});

export const { setSocketConnected,setSocket } = socketSlice.actions;
export default socketSlice.reducer;









// import { createSlice } from "@reduxjs/toolkit";

// const socketSlice=createSlice({
//     name:"socketio",
//     initialState:{
//         socket:null
//     },
//     reducers:{
//         setSocket:(state,action)=>{
//             state.socket=action.payload
//         }
//     }
// })
// export const {setSocket} =socketSlice.actions;
// export default socketSlice.reducer;
