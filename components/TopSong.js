import { useRecoilState } from "recoil";
import { isPlayingState, currentTrackIdState  } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";

function TopSong({order, track}){
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = () =>{
        setCurrentTrackId(track.track.id)
        spotifyApi.play({uris: [track.track.uri]})
        setIsPlaying(true)
    }

    return (
        <div onClick={playSong} className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-4">
                <p> {order+1}</p>
                <img src={track.track.album.images[0].url} className="h-10 w-10" alt=""/>
                <div>
                    <p className="w-36 lg:w-65 truncate text-white">
                        {track.track.name}
                    </p>
                    <p className="hidden md:inline w-40">
                        {track.track.artists[0].name}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="hidden md:inline w-40">
                    {track.track.album.name}
                </p>
                <p className="hidden md:inline w-40">
                    {track.track.popularity} plays this month
                </p>
            </div>
        </div>
    )
}

export default TopSong;