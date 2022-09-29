import React, { useEffect, useRef } from 'react';

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
    // user.audioTrack.setEnabled(true);
  }, []);

  return (
    <div>
      Uid: {user.uid}
      <div
        ref={ref}
        style={{ width: '220px', height: '210px' }}
      ></div>
    </div>
  );
};