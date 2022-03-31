import { useSession } from "next-auth/react";
import useSongInfo from "../hooks/useSongInfo"
import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { featuresState  } from "../atoms/featuresAtom";
import { activeState  } from "../atoms/activeAtom";
import useSpotify from "../hooks/useSpotify";
import { isPlayingState, currentTrackIdState  } from "../atoms/songAtom";
import { ReplyIcon, SwitchHorizontalIcon, VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline";
import { PlayIcon, PauseIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player(){
    const spotifyApi = useSpotify()
    const {data: session, status} = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [features, setFeatures] = useRecoilState(featuresState);
    const [isActive, setIsActive] = useRecoilState(activeState);
    const [volume, setVolume] = useState(50);
    const [shuffle, setShuffle] = useState(false)
    const [repeat, setRepeat] = useState("context")

    const songInfo = useSongInfo();
    const fetchCurrentSong = () => {
        if(!songInfo){
            spotifyApi.getMyDevices().then((data) =>{
                if(data.body.devices[0]?.is_active){
                    setIsActive(true);
                    spotifyApi.getMyCurrentPlayingTrack().then((data) =>{
                        setCurrentTrackId(data.body?.item?.id);
                        spotifyApi.getAudioFeaturesForTrack(data.body?.item?.id).then((res)=>{
                            setFeatures(res.body)
                        })
                        
                    })
                    spotifyApi.getMyCurrentPlaybackState().then((data) => {
                        setIsPlaying(data.body?.is_playing)
                        setShuffle(data.body?.shuffle_state)
                        setRepeat(data.body?.repeat_state)
                    })  
                }
                else{
                    setIsActive(false);
                }
            })
        }
    }

    useEffect(()=>{
        spotifyApi.getMyDevices().then((data) =>{
            if(data.body.devices[0]?.is_active){
                setIsActive(true);
                if(spotifyApi.getAccessToken() && !currentTrackId)
                {
                    fetchCurrentSong()
                    setVolume(50);
                    
                }
            }
            else{
                setIsActive(false);
            }
        })
    },[currentTrackId, spotifyApi, session])

    useEffect(()=>{
        if(volume > 0 && volume < 100){
            deboundedAdjustVolume(volume)
        }
    },[volume])

    const deboundedAdjustVolume = useCallback(
        debounce((volume)=>{
            spotifyApi.setVolume(volume).catch((err)=>{})
        }, 500), []
    )

    const handlePlayPause = () =>{
        spotifyApi.getMyDevices().then((data) =>{
            if(data.body.devices[0]?.is_active){
                setIsActive(true);
                spotifyApi.getMyCurrentPlaybackState().then((data) =>{
                    if(data.body.is_playing){
                        spotifyApi.pause()
                        setIsPlaying(false)
                    }
                    else{
                        spotifyApi.play()
                        setIsPlaying(true)
                    }
                })
            }
            else{
                setIsActive(false);
            }
        })
    }

    const handleShuffle = () =>{
        spotifyApi.getMyDevices().then((data) =>{
            if(data.body.devices[0]?.is_active){
                setIsActive(true);
                spotifyApi.getMyCurrentPlaybackState().then((data) =>{
                    if(data.body.shuffle_state){
                        spotifyApi.setShuffle(false)
                        setShuffle(false)
                    }
                    else{
                        spotifyApi.setShuffle(true)
                        setShuffle(true)
                    }
                })
            }
            else{
                setIsActive(false);
            }
        })
        
    }
    const handleRepeat = () =>{
        spotifyApi.getMyDevices().then((data) =>{
            if(data.body.devices[0]?.is_active){
                setIsActive(true);
                spotifyApi.getMyCurrentPlaybackState().then((data) =>{
                    if(data.body.repeat_state === "track"){
                        spotifyApi.setRepeat("off")
                        setRepeat("off")
                    }
                    else{
                        spotifyApi.setRepeat("track")
                        setRepeat("track")
                    }
                })
            }
            else{
                setIsActive(false);
            }
        })   
    }

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            { isActive ? 
                <div className="flex items-center space-x-4">
                    <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
                    <div>
                        <h3 className="w-36 text-white lg:w-72 truncate">
                            {songInfo?.name}
                        </h3>
                        <p className="text-gray-500">
                            {songInfo?.artists?.[0]?.name}
                        </p>
                    </div>
                </div>
            : 
                <div className="flex items-center space-x-4">
                    <div>
                        <h3 className="w-36 text-white lg:w-72 truncate">
                            {"Warning: No Active Spotify Device"}
                        </h3>
                        <p className="text-gray-500">
                            {"This app requires an active Spotify device to be running for full feature set"}
                        </p>
                    </div>
                </div>
            }
            <div className="flex items-center justify-evenly">

                {shuffle ? (
                    <div className="text-green-500">
                        <SwitchHorizontalIcon onClick={handleShuffle} className="button" />
                    </div>
                )
                :
                (
                    <div className="text-white">
                        <SwitchHorizontalIcon onClick={handleShuffle} className="button" />
                    </div>
                )}
                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"  />
                )
                :
                (
                    <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
                )}
                {(repeat === "track") ? (
                    <div className="text-green-500">
                        <ReplyIcon onClick={handleRepeat} className="button"/>
                    </div>
                )
                :
                (
                    <div className="text-white">
                        <ReplyIcon onClick={handleRepeat} className="button"/>
                    </div>
                )}

            </div>

            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeOffIcon onClick={() => {volume > 0 && setVolume(volume-10)}} className="button"/>
                <input className="w-14 md:w-28"type="range" value={volume} onChange={(e)=>{setVolume(Number(e.target.value))}} min={0} max={100} />
                <VolumeUpIcon onClick={() => {volume < 100 && setVolume(volume+10)}} className="button"/>
            </div>
        </div>
    );
}

export default Player