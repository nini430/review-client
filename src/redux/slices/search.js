import {createSlice} from "@reduxjs/toolkit"

const initialState={
    searchResults:null,
    searchWord:""
}

const search=createSlice({
    name:"search",
    initialState,
    reducers:{
        getSearchResults:(state,{payload})=>{
            state.searchResults=payload;
        },
        addSearchWord:(state,action)=>{
            state.searchWord=action.payload;
        }
    }
})

export const {getSearchResults,addSearchWord}=search.actions;
export default search.reducer;