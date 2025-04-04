import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import defaultprofilepic from '../../Photo/defaultprofilepic.png'
import './Leaderboard.css'
import {CircleAlert, Compass , Info,HandHeart,MessagesSquare,Waypoints,Users,Gem} from 'lucide-react'
import { UserAuthCheckContext } from "../../Context/UserAuthCheck";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const {usertoken} = useContext(UserAuthCheckContext);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("/api/users/leaderboard");
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <h2><p><Compass size={20}  /> Leaderboard </p> <span 
          className="info-icon" 
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info size={18} />
          {showTooltip && (
            <div className="tooltip">
              <strong>How does the Leaderboard work?</strong><br />
              <HandHeart size={13}/> <strong>1 point</strong> per Like <br />
              <MessagesSquare size={13}/> <strong>2 points</strong> per Comment <br />
              <Waypoints size={13}/> <strong>3 points</strong> per Share <br />
              <Users size={13}/> <strong>5 points</strong> per Follower <br />
              🏆 Get more engagement to rank higher!
            </div>
          )}
        </span></h2>
      <ul>
        {leaderboard.map((user, index) => (
          <li key={user.id}>
           <div className="leader-board-img">
            <img src=   {user.profile_pic ? user.profile_pic : defaultprofilepic} alt={user.username} className="profile-pic" />
            <div className="leader-own-user">
            <span className="username">{user.username}</span>
            {user.username === usertoken.user.username ? <p style={{fontSize : '0.9rem'}}>You</p> : ''}
            </div>
            </div>
            <div className="leadboard-rank-box">
            <span className="rank" style={{ color: index >= 7 ? 'red' : index >= 3 ? 'orange' : '' }}>#{index + 1}</span>
            <span className="score"><Gem  size = {14} color="black"/> {user.engagement_score} Points</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
