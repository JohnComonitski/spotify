import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import { displayState } from "../atoms/displayAtom";
import useSpotify from "../hooks/useSpotify";

function PlaylistCard({order, playlist}){
    const spotifyApi = useSpotify()
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
    const [display, setDisplay] = useRecoilState(displayState)

    function handleClick(){
        setPlaylistId(playlist.id); 
        setDisplay("playlist");
    }

    return (
        <div onClick={handleClick} className="block text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-4">
                <img src={playlist.images[0].url} className="" alt=""/>
            </div>

            <div className="block items-center justify-between ml-auto md:ml-0">
                <p className="truncate text-white">
                    {playlist.name}
                </p>
                <p>
                    By: {playlist.owner.display_name}
                </p>
            </div>
        </div>
    )
}

export default PlaylistCard;