import React, { useEffect } from 'react';
import './style.scss';
import SVGA from 'svgaplayerweb';

const Loading: React.FC<{
  onClose: () => void,
}> = ({ onClose }) => {
  let init = true;

  useEffect(() => {
    if(init){
      init = false;
      var player = new SVGA.Player('#loadingCanvas');
      var parser = new SVGA.Parser('#loadingCanvas');
      parser.load('./images/loading.svga', function (videoItem) {
        player.setVideoItem(videoItem);
        player.onPercentage
        // player.onFrame((frame) => {
        //   if(frame == 0){
        //     if (onClose) {
        //       onClose()
        //     }
        //   }
        // });

        
        player.startAnimation();
        player.clearsAfterStop = true;
      })

      return () => {
        player.pauseAnimation();
      }
    }
  },[])

  return <div className="loading-box">
    <div id="loadingCanvas"></div>
    <div className="loading-text">Loading</div>
  </div>
};

export default Loading;
