import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';

const APP_ID = '16c264d3a19442a48a8d5f754780e6f8';
const TOKEN =
  '007eJxTYLCYViRfMuOuzgfZn3F93GYCe40aNWZr5p7nDnq67bTqjQcKDIZmyUZmJinGiYaWJiZGiSYWiRYppmnmpibmFgapZmkWB5pNkx2umiUfru5mZGSAQBCfnSEvtTwlNTefgQEAchghag==';
const CHANNEL = 'newdemo';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});


export const VideoRoom = ({leave}) => {
  const [mic,setMic] = useState(true);
  const [video,setVideo]  = useState(true);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);

  const handleUserJoined = async (user, mediaType) => {
    
    
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user]);
          }
      
          if (mediaType === 'audio') {
            user.audioTrack.play()
          }
    
    
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  const handleVideo = () => { 
    localTracks[1].setEnabled(!video)
    setVideo(!video)
  }

  const handleMic = () => { 
    
    localTracks[0].setEnabled(!mic)
    setMic(!mic)
  }

  useEffect(() => {
    if(!userId){
    
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([
          AgoraRTC.createMicrophoneAndCameraTracks(),
          uid,
        ])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        console.log('uisdasd',uid);
        setUserId(uid)
        client.publish(tracks);
      });
    //   localTracks[1].setEnabled(video)
    //   localTracks[0].setEnabled()
    }
    if(leave){
        console.log(users,'asdasasdasdad')
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off('user-published', handleUserJoined);
      client.off('user-left', handleUserLeft);
      client.unpublish(localTracks).then(() => client.leave());
      setUsers([])
    }
    console.log(users);
  }, [leave]);

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center',flexDirection: 'column',maxWidth: '500px',margin: 'auto',paddingTop: '20px'}}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 220px)',
          gap: '60px'
        }}
      >
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
          
        ))}
       
      </div>
      <button onClick={handleMic}>Mic off</button>
        <button onClick={handleVideo} >Video off</button>
    </div>
  );
};