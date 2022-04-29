import React, {
  PointerEvent, useEffect, useRef, useState,
} from 'react';
import { SpotifyPlaybackManager } from './SpotifyPlaybackManager';
import { YouTubePlaybackManager } from './YouTubePlaybackManager';
import './PlaybackManager.scss';

/**
 * Handles playback, and all other playback handlers
 * THERE SHOULD ONLY EVER BE 1 OF THESE
 */
export function PlaybackManager() {
  const mainDiv = useRef<HTMLDivElement>(null);
  const contentDiv = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(20);
  const [offsetY, setOffsetY] = useState(100);
  const [pointerEvent, setPointerEvent] = useState<PointerEvent>();
  const dragPointer = useRef<number | null>(null);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  // When we spawn, steal the mediaplayers div and display it properly
  useEffect(() => {
    const mediaPlayersHolder = document.getElementById('mediaplayers');
    if (!mediaPlayersHolder) { return () => {}; }

    contentDiv.current?.appendChild(mediaPlayersHolder);

    return () => {
      document.body.appendChild(mediaPlayersHolder);
    };
  }, []);

  /**
   * Handle pointerup/move/down events
   */
  useEffect(() => {
    if (!pointerEvent) { return; }
    if (pointerEvent.type === 'pointerdown') {
      // We're just starting a 'drag'
      if (dragPointer.current !== null) { return; }
      dragPointer.current = pointerEvent.pointerId;
      mainDiv.current?.setPointerCapture(dragPointer.current);
      dragStartX.current = pointerEvent.nativeEvent.offsetX;
      dragStartY.current = pointerEvent.nativeEvent.offsetY;
    } else if (pointerEvent.type === 'pointermove') {
      if (dragPointer.current !== pointerEvent.pointerId) { return; }
      setOffsetX(offsetX - pointerEvent.movementX);
      setOffsetY(offsetY - pointerEvent.movementY);
    } else if (pointerEvent.type === 'pointerup') {
      if (dragPointer.current === pointerEvent.pointerId) {
        try {
          // This is erroring(?) on mobile. Doesn't seem to effect dragging though???
          mainDiv.current?.releasePointerCapture(dragPointer.current);
        } catch (e) {
          //
        }
        dragPointer.current = null;
      }
    }
  }, [pointerEvent]);

  return (
    <>
      <div
        className="PlaybackDisplay"
        ref={mainDiv}
        style={{ right: offsetX, bottom: offsetY }}
        onPointerDown={(e) => setPointerEvent(e)}
        onPointerMove={(e) => setPointerEvent(e)}
        onPointerUp={(e) => setPointerEvent(e)}
      >
        <div className="PlaybackDisplay__Drag" />
        <div className="PlaybackDisplay__Placeholder">
          <p>Media content will display here when playing.</p>
        </div>
        <div className="PlaybackDisplay__Holder" ref={contentDiv} />
      </div>
      <YouTubePlaybackManager />
      <SpotifyPlaybackManager />
    </>
  );
}
