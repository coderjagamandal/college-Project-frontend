import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import './VideoPost.css'

const VideoPost = ({ videoSrc }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showvideocontrolar, setShowvideovideocontrolr] = useState(false);

    useEffect(() => {
        if (!videoRef.current) return;

        // Auto-play logic when in viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (isMuted) {

                        videoRef.current.muted = true;
                    }
                    videoRef.current.play().catch(() => setIsPlaying(false));
                    setIsPlaying(true);
                } else {
                    videoRef.current.pause();
                    setIsPlaying(false);
                    videoRef.current.currentTime = 0;
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(videoRef.current);

        return () => observer.disconnect();
    }, []);

    // Handle Play/Pause
    const togglePlay = () => {
        setShowvideovideocontrolr(true);
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
        const controlar = () => {
            setTimeout(() => {
                setShowvideovideocontrolr(false)
            }, 3000);
        }
        controlar()

        return () => clearTimeout(controlar);
    };


    // Handle Mute/Unmute
    const toggleMute = () => {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    // Handle Progress Update
    const handleProgress = () => {
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;

        setProgress((current / total) * 100);
        setCurrentTime(current);
        setDuration(total);
    };
    const handleProgresschange = (event)=>{
        const value = event.target.value;
        event.target.style.setProperty("--progress", `${value}%`);
    }

    // Seek Video
    const handleSeek = (e) => {
        const newTime = (e.target.value / 100) * duration;
        videoRef.current.currentTime = newTime;
        setProgress(e.target.value);
    };


    return (
        <div className="video-container">
            <video
                ref={videoRef}
                src={videoSrc}
                className="custom-video"
                preload="metadata"
                playsInline
                loop
                muted={isMuted}
                onClick={togglePlay}
                onChange={handleProgresschange}
                onTimeUpdate={handleProgress}
                onLoadedMetadata={() => setDuration(videoRef.current.duration)}
            />

            {/* Custom Controls */}
            <div className="video-controls" style={{opacity : showvideocontrolar ? '1' : '0'}}>
                <button onClick={togglePlay} className="control-btn">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <input
                    type="range"
                    className="video-progress-bar"
                    value={progress}
                    onChange={handleSeek}
                />

                <span className="time">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <button onClick={toggleMute} className="control-btn">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>
        </div>
    );
};

// Format time function (00:00)
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default VideoPost;
