import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo"
import Canvas from "./Canvas";
import { useEffect, useState } from "react";

function LavaLamp(){
    const songInfo = useSongInfo();
    const [song, setSong] = useState({title: "Mouse over the sidebar to select a song", album:"https://m.media-amazon.com/images/I/71+CYj7vQgL._SS500_.jpg", artist:"No Song Selected"})
    useEffect(()=>{
        if(songInfo !== null){
            setSong({
                title: songInfo?.name, 
                album: songInfo?.album.images[0].url, 
                artist: songInfo?.artists[0].name
            })
        }
        else{
            setSong({title: "Mouse over the sidebar to select a song", album:"https://m.media-amazon.com/images/I/71+CYj7vQgL._SS500_.jpg", artist:"No Song Selected"})
        }
    },[songInfo])

    return (
        <div className="relative">
            <Canvas />
            <section className={`absolute top-0 left-8 flex items-end space-x-7 h-80 text-white p-8 `}>
                <img className={`rounded h-44 w-44 shadow-2xl`} src={song.album} alt="" />
                <div>
                    <p className="">{song.artist}</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{song.title}</h1>
                </div>
            </section>
            <div className={`absolute text-xs opacity-25 flex items-end w-screen h-screen text-white`}>
                <p className=""> Network design inspired by <a href="https://www.youtube.com/watch?v=d620nV6bp0A">Franks Laboratory </a></p>
            </div>

        </div>
    )
}

export default LavaLamp;