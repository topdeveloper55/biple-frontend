import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Sidenav from 'components/LeftNav';
import ConnectWallet from './views/WalletConnect';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import Login from 'views/Login';
import Rightnav from 'components/RightNav';
import CollectionMenu from 'components/CollectionMenu';
import Dashboard from 'views/Sale/Dashboard';
import Register from 'views/Register';
import Team from 'views/Team';
import Store from 'views/Store';
import Invitation from 'views/Invitation';
import Voice from 'views/VoiceChat/';
import Chat from 'views/Chat';
// import Announcement from 'views/announcements'
import Wallet from 'views/Sale/Wallet';
import History from 'views/Sale/History';
import Home from 'views/Home';
import Details from 'views/Sale/Details';
// import PrivateChat from 'views/private/index';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import Referral from 'views/Referral';
import ComingSoon from 'views/Status/CommingSoon';
import General from 'views/Admin/General';
import Roles from 'views/Admin/Roles';
import Marketplace from 'views/Admin/Marketplace';
import UserSettings from 'views/User/Settings';
import TeamSettings from 'views/Admin/Team';

function App() {
  const [index, setIndex] = useState<number>(-1);

  const { account } = useWeb3React<Web3Provider>();
  const { pathname } = useLocation();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  // useEffect(() => {
  //   if(accessToken === '') history.push('/')
  // }, [accessToken])
  return (
    <div
      className={`min-h-screen flex ${
        account && pathname === '/connect' ? 'flex-col' : 'flex-row'
      } bg-[#f5f5f5] dark:bg-[#202020] gap-3.5`}
    >
      {accessToken !== '' && <Sidenav index={index} setIndex={setIndex} />}
      <div className="flex flex-col gap-3.5 flex-grow min-h-screen max-h-screen">
        {accessToken !== '' && <CollectionMenu />}
        <div
          className={`flex gap-3.5 flex-grow max-h-${
            pathname === '/private' || pathname === '/user/settings' ? 'screen' : '[calc(100vh-112px)]'
          }`}
        >
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/auth/login" component={Login} />
            <Route exact path="/auth/register" component={Register} />
            <Route exact path="/connect" component={ConnectWallet} />
            <Route exact path="/sale/dashboard" component={Dashboard} />
            <Route exact path="/sale/wallet" component={Wallet} />
            <Route exact path="/sale/history" component={History} />
            <Route
              exact
              path="/sale/collections/:address/:id"
              component={Details}
            />
            <Route exact path="/team" component={Team} />
            <Route exact path="/store" component={Store} />
            <Route exact path="/invitation" component={Invitation} />
            <Route exact path="/voice" component={Voice} />
            <Route exact path="/chat" component={Chat} />
            {/* <Route exact path="/private" component={PrivateChat} /> */}
            {/* <Route exact path="/announcement" component={Announcement} /> */}
            <Route exact path="/private" component={Chat} />
            <Route exact path="/announcement" component={Chat} />
            <Route exact path="/sneak" component={ComingSoon} />
            <Route exact path="/roadmap" component={ComingSoon} />
            <Route exact path="/official" component={ComingSoon} />
            <Route exact path="/security" component={ComingSoon} />
            <Route exact path="/nfts" component={ComingSoon} />
            <Route exact path="/gaming" component={ComingSoon} />
            <Route exact path="/cryptocurrency" component={ComingSoon} />
            <Route exact path="/3d-design" component={ComingSoon} />
            <Route exact path="/r/:referral" component={Referral} />
            <Route exact path="/" component={Referral} />
            <Route exact path="/admin/general" component={General} />
            <Route exact path="/admin/role" component={Roles} />
            <Route exact path="/admin/marketplace" component={Marketplace} />
            <Route exact path="/admin/member" component={TeamSettings} />
            <Route exact path="/admin/overview" component={ComingSoon} />
            <Route exact path="/user/settings" component={UserSettings} />
            <Redirect to="/sale/dashboard" from="/sale" />
            <Redirect to="/" />
          </Switch>
          {accessToken !== '' && <Rightnav />}
        </div>
      </div>
    </div>
  );
}

export default App;
