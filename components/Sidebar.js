import { CubeTransparentIcon, LibraryIcon, HeartIcon } from "@heroicons/react/outline"
import { useSession } from "next-auth/react"
import { useEffect } from "react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil"
import { playlistIdState, playlistListState } from "../atoms/playlistAtom"
import { topTracksState } from "../atoms/topTrackAtom"
import { displayState } from "../atoms/displayAtom"

function Sidebar(props){
    const { setHidePlayer } = props;
    const {data: session, status} = useSession();
    const [playlistsList, setPlaylistsList] = useRecoilState(playlistListState)
    const spotifyApi = useSpotify()
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    const [topTracks, setTopTracks] = useRecoilState(topTracksState)
    const [display, setDisplay] = useRecoilState(displayState)
    
    useEffect(()=>{
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylistsList(data.body.items)
            })
            spotifyApi.getMyTopTracks().then((data)=>{
                setTopTracks(data.body.items)
            });
        }
    },[session, spotifyApi])

    return (
    
        <div className="text-gray-500 overflow-hidden hover:p-5 text-sm border-r-4 border-gray-700 overflow-y-s h-screen w-0 hover:min-w-[15rem] hover:max-w-[15rem] scrollbarhide inline-flex pb-36">
            <div className="space-y-4">
                <button onClick={()=>{ setDisplay("LavaLamp"); setHidePlayer(true);}} className="flex items-center space-x-2 hover:text-white">
                    <CubeTransparentIcon className="h-5 w-5"/>
                    <p>Visualize</p>
                </button>
                <button onClick={()=>{setDisplay("library"); setHidePlayer(false);}} className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5"/>
                    <p>Your Library</p>
                </button> 
                <button onClick={()=>{setDisplay("toptracks"); setHidePlayer(false);}} className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5"/>
                    <p>Top Tracks</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-700" />
                {
                    playlistsList.map((playlist) => (
                        <p onClick={()=>{setPlaylistId(playlist.id); setDisplay("playlist"); setHidePlayer(false);}} key={playlist.id} className="cursor-pointer hover:text-white">
                            {playlist.name}
                        </p>
                    )) 
                }
            </div>
        </div>
    )
}

export default Sidebar