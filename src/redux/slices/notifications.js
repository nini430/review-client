import {createSlice} from "@reduxjs/toolkit"


const initialState={
    notifications:[]
}


const notificationsSlice=createSlice({
    name:"notifications",
    initialState,
    reducers :{
        addNotification:(state,action)=>{
            console.log(action.payload);
            state.notifications=[action.payload,...state.notifications]
        },
        getNotifications:(state,action)=>{
            state.notifications=action.payload
        },
        removeNotifications:(state,{payload})=>{
            state.notifications=state.notifications.filter(item=>item.id!==payload.id);
        },
        replaceNotification:(state,{payload})=>{
            state.notifications=state.notifications.map(item=>item.id===payload.id?payload:item);
        },
        clearNotifications:(state)=>{
            state.notifications=[];
        }
        
    }
})

export const {addNotification,getNotifications,removeNotifications,replaceNotification,clearNotifications}=notificationsSlice.actions;

export default notificationsSlice.reducer;

