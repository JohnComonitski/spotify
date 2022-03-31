import { useRecoilValue } from "recoil";
import { playlistListState } from "../atoms/playlistAtom";
import PlaylistCard from "./PlaylistCard"

function PlayListCards(){
    const playlistsList = useRecoilValue(playlistListState)

    return (
        <div className="px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 space-y-1 pb-28 text-white">
            {playlistsList?.map((playlist, i) => (
                <PlaylistCard key={playlist.id} playlist={playlist} order={i} />
            ))}
        </div>
    )
}

export default PlayListCards;