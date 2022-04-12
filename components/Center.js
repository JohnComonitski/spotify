import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react"
import useSongInfo from "../hooks/useSongInfo"
import React, { useEffect, useState, useRef } from "react";
import { shuffle } from "lodash"
import { useRecoilValue, useRecoilState } from "recoil"
import { playlistIdState, playlistState, playlistListState } from "../atoms/playlistAtom"
import { displayState } from "../atoms/displayAtom"
import { topTracksState } from "../atoms/topTrackAtom"
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs"
import TopTracks from "./TopTracks"
import PlaylistCards from "./PlaylistCards"
import LavaLamp from "./LavaLamp"


const colors = [
    "from-red-500",
    "from-blue-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
    "from-indigo-500",
]

function Center(props){
    const {hidePlayer, setHidePlayer} = props
    const songInfo = useSongInfo();
    const { data : session } = useSession();
    const top = useRef(null);
    const spotifyApi = useSpotify();
    const [color, setColor] = useState(null)
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const topTracks = useRecoilValue(topTracksState)
    const playlistsList = useRecoilValue(playlistListState)
    const display = useRecoilValue(displayState)
    const [data, setData] = useState(
        {
            title:"",
            name: "",
            content: (<div></div>),
            img:""
        }
    )

    useEffect(()=>{
        setColor(shuffle(colors).pop())
        if(display === "library"){
            setData({
                title:"Your Playlist",
                name: "Your Spotify Library",
                img: playlistsList[0]?.images[0].url,
                content: (<PlaylistCards />)
            })
        }
        else if(display === "toptracks"){
            setData({
                title:"Your Top Tracks",
                name: "Your Top 20 Spotify Tracks From The Past 6 Months",
                img: topTracks[0]?.album.images[0].url,
                content: (<TopTracks />)
            })
        }
        else if(display === "playlist"){
            setData({
                title:"Playlist",
                name: playlist?.name,
                img: playlist?.images[0].url,
                content: (<Songs />)
            })
        }
        else if(display === "LavaLamp"){
            setData({
                title:songInfo?.name,
                name: songInfo?.artists?.[0]?.name,
                content: (<LavaLamp />),
                img:songInfo?.album.images?.[0]?.url
            })
            setHidePlayer(true);
        }
        window.scrollTo({top: 0, behavior: 'smooth'})
    },[playlistId, display, playlist])

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data =>{
            setPlaylist(data.body)
        })).catch((err)=>{console.log(err)})
    },[spotifyApi, playlistId]) 

    return (
        <div ref={top} className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className={"absolute top-5 right-8 " + (hidePlayer ? "hidden" : "")} >
                <div className="flex item-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pl-5 pr-2 text-white" onClick={signOut}>
                    <h2 className="py-1.5" > {session?.user.name} </h2>
                    <ChevronDownIcon className="h-5 w-5 mt-2" />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 ${(hidePlayer ? "hidden" : "")}`}>
                <img className="h-44 w-44 shadow-2xl" src={data.img} alt="" />
                <div>
                    <p>{data.title}</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{data.name}</h1>
                </div>
            </section>

            <div className="bg-black">
                {data.content}
            </div>
            
        </div>
    )
}

export default Center