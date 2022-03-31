import { atom } from "recoil"

export const playlistIdState = atom({
    key : "playlistIdState",
    default: "6HMRJhX1YC7erAH2KB0sZE",
});
 
export const playlistState = atom({
    key: "playlistState",
    default: null,
});

export const playlistListState = atom({
    key: "playlistListState",
    default: [],
});


