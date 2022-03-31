import { useRecoilValue } from "recoil";
import { topTracksState } from "../atoms/topTrackAtom"
import TopSong from "./TopSong"

function TopTracks(){
    const topTracks = useRecoilValue(topTracksState)

    return (
        <div className="px-8 flex-col space-y-1 pb-28 text-white">
            {topTracks.map((track, i) => (
                <TopSong key={track.id} track={{track:track}} order={i} />
            ))}
        </div>
    )
}

export default TopTracks;