import { useRecoilState, useRecoilValue  } from "recoil";
import { isPlayingState, currentTrackIdState  } from "../atoms/songAtom";
import { featuresState  } from "../atoms/featuresAtom";
import { playlistState } from "../atoms/playlistAtom";
import { activeState  } from "../atoms/activeAtom";
import useSpotify from "../hooks/useSpotify";

function Song({order, track}){
    const spotifyApi = useSpotify()
    const playlist = useRecoilValue(playlistState);
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [features, setFeatures] = useRecoilState(featuresState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [isActive, setIsActive] = useRecoilState(activeState);

    const playSong = () =>{
        spotifyApi.getMyDevices().then((data) =>{
            if(data.body.devices[0]?.is_active){
                setIsActive(true);
                setCurrentTrackId(track.track.id)
                spotifyApi.getAudioFeaturesForTrack(track.track.id).then((res)=>{
                    setFeatures(res.body)
                })
                spotifyApi.play({uris: [track.track.uri]})
                setIsPlaying(true)
                
                /*
                for(var i = order+1; i < playlist.tracks.items.length; i++){
                    console.log("URI",playlist.tracks.items[i].track.uri)
                    try{
                        spotifyApi.addToQueue(playlist.tracks.items[i].track.uri).then((res)=>{
                            console.log(i)
                        })
                    }
                    catch(err){

                    }
                }
                */
            }
            else{
                setIsActive(false);
            }
        })
    }

    return (
        <div onClick={playSong} className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-4">
                <p className="hidden md:inline"> {order+1}</p>
                <img src={track.track.album.images[0].url} className="h-10 w-10" alt=""/>
                <div>
                    <p className="w-36 lg:w-70 truncate text-white">
                        {track.track.name}
                    </p>
                    <p className="w-40">
                        {track.track.artists[0].name}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="hidden md:inline w-40">
                    {track.track.album.name}
                </p>
                <p className="hidden md:inline">
                    {millisToMinutesAndSeconds(track.track.duration_ms)}
                </p>
            </div>
        </div>
    )
}

function millisToMinutesAndSeconds(millis){
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0)

    return seconds == 60
        ? minutes + 1 + ":00"
        : minutes + ":" + (seconds < 10 ? "0" : "") +
        seconds;
}

export default Song;