import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';

import LeaderboardContent from '../../components/leaderboardContent';
import ProfileModule from '../../components/profileModule';


const LeaderboardPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();

  const [showProfileModule, setProfileModuleStatus] = useState(false);
  const [user, setUser] = useState();

  const showUser = (user:any) => {
    setUser(user);
    setProfileModuleStatus(true);
  }

  return (
    <div className="leaderboard-page">
      <LeaderboardContent props={{from: 'page' }} onShowUser={showUser}/>
      {showProfileModule && <ProfileModule props={{user}} onClose={() => {setProfileModuleStatus(false);}}/>}
    </div>
  )
};

export default LeaderboardPage;
