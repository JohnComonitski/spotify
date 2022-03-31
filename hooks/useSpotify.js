import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET
})

function useSpotify(){
    const { data : session, status } = useSession();
    
    useEffect(() => {
        try{
            if(session){
                if(session.error === "RefreshAccessTokenError"){
                    signIn()
                }
                spotifyApi.setAccessToken(session.user.accessToken)
            }
            else if(session === null){
                console.log("NULL SESSION")
                //signIn()
            }
        }
        catch(err){
            console.log(err)
        }
    }, [session])

    return spotifyApi
}

export default useSpotify