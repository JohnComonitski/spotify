import Sidebar from '../components/Sidebar'
import React, { useState } from '"react/cjs/react.development"'
import Center from '../components/Center'
import Player from '../components/Player'
import { getSession } from 'next-auth/react'

export default function Home() {
  
  const [hidePlayer, setHidePlayer] = useState(false);

  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className='flex'> 
        <Sidebar setHidePlayer={setHidePlayer} />
        <Center hidePlayer={hidePlayer} setHidePlayer={setHidePlayer} />
      </main>

      <div className={'sticky bottom-0' + (hidePlayer ? " hidden" : "")}>
        <Player />
      </div>
    </div>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context);

  return {
    props: {
      session,
    }
  }
}