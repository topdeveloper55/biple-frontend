import dashboard from 'assets/images/dashboard.png'
import about from 'assets/images/about.png'
import settings from 'assets/images/settings.png'
import history from 'assets/images/history.png'
import wallet from 'assets/images/wallet.png'

import announcement from 'assets/images/announce.png'
import sneak from 'assets/images/camera.png'
import roadmap from 'assets/images/roadmap.png'
// import official from 'assets/images/link.png'
import chat from 'assets/images/chat.png'
// import security from 'assets/images/security.png'
import invite from 'assets/images/invite.png'
import sale from 'assets/images/dollar.png'
import team from 'assets/images/team.png'
import store from 'assets/images/store.png'
import mode from 'assets/images/mode.png'

import Tron1 from 'assets/images/trons/tron1.png'
import Tron2 from 'assets/images/trons/tron2.png'
import Tron3 from 'assets/images/trons/tron3.png'
import Tron4 from 'assets/images/trons/tron4.png'
import Tron5 from 'assets/images/trons/tron5.png'
import Tron6 from 'assets/images/trons/tron6.png'
import Tron7 from 'assets/images/trons/tron7.png'
import Tron8 from 'assets/images/trons/tron8.png'
import Tron9 from 'assets/images/trons/tron9.png'
import Tron10 from 'assets/images/trons/tron10.png'

export const menuData = [
  {
    type: "item",
    icon: dashboard,
    label: "Dashboard",
    path: "/sale/dashboard"
  },
  {
    type: "group",
    label: "Profile",
    children: [
      {
        type: "item",
        icon: wallet,
        label: "My Wallet",
        path: "/sale/wallet"
      },
      {
        type: "item",
        icon: history,
        label: "History",
        path: "/sale/history"
      },
      {
        type: "item",
        icon: settings,
        label: "Settings",
        path: "/sale/settings"
      }
    ]
  },
  {
    type: "group",
    label: "Others",
    children: [
      {
        type: "item",
        icon: about,
        label: "About",
        path: "/sale/about"
      },
    ]
  }
]

export const rightMenuData = [
  {
    image: announcement,
    label: 'Announcements',
    path: '/announcement',
  },
  {
    image: sneak,
    label: 'Sneak-peeks',
    path: '/sneak',
  },
  {
    image: roadmap,
    label: 'Roadmap',
    path: '/roadmap',
  },
  // {
  //   image: official,
  //   label: 'Official links',
  //   path: '/official',
  // },
  {
    image: chat,
    label: 'Voice chat',
    path: '/voice',
  },
  // {
  //   image: security,
  //   label: 'Security',
  //   path: '/security',
  // },
  {
    image: invite,
    label: 'Invitation',
    path: '/invitation',
  },
  {
    image: sale,
    label: 'Marketplace',
    path: '/sale',
  },
  {
    image: team,
    label: 'Team',
    path: '/team',
  },
  {
    image: store,
    label: 'Store',
    path: '/store',
  },
  {
    image: mode,
    label: 'Admin panel',
    path: '/admin/general',
  },
]

export const adminMenuData = [
  {
    label: 'General',
    path: '/admin/general',
    newFeature: false
  },
  {
    label: 'Roles',
    path: '/admin/role',
    newFeature: false
  },
  {
    label: 'Marketplace',
    path: '/admin/marketplace',
    newFeature: true
  },
  {
    label: 'Team',
    path: '/admin/member',
    newFeature: false
  },
  {
    label: 'Overview',
    path: '/admin/overview',
    newFeature: false
  },
]

export const saleData = [
  {
    image: Tron1,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#482",
    tokenId: 482,
    currentBid: "0.25",
    buyNow: "0.35",
    symbol: "eth"
  },
  {
    image: Tron2,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#8643",
    tokenId: 8643,
    currentBid: "0.27",
    buyNow: "0.35",
    symbol: "eth"
  },
  {
    image: Tron3,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#163",
    tokenId: 163,
    currentBid: "0.26",
    buyNow: "0.35",
    symbol: "eth"
  },
  {
    image: Tron4,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#713",
    tokenId: 713,
    currentBid: "0.25",
    buyNow: "0.35",
    symbol: "eth"
  },
  {
    image: Tron5,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#2313",
    tokenId: 2313,
    currentBid: "0.27",
    buyNow: "0.35",
    symbol: "eth"
  },
  {
    image: Tron6,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#166",
    tokenId: 166,
    currentBid: "0.26",
    buyNow: "0.35",
    symbol: "eth"
  },
  {
    image: Tron7,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#1437",
    tokenId: 1437,
    currentBid: "0.25",
    buyNow: "0.35",
    symbol: "eth"
  },
  {
    image: Tron8,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#3351",
    tokenId: 3351,
    currentBid: "0.27",
    buyNow: "0.35",
    symbol: "eth"
  },
  {
    image: Tron9,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#673",
    tokenId: 673,
    currentBid: "0.27",
    buyNow: "0.35",
    symbol: "eth"
  },
  {
    image: Tron10,
    collection: "Tronwars",
    collectionAddress: "0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0",
    verified: true,
    name: "Tron#109",
    tokenId: 109,
    currentBid: "0.25",
    buyNow: "0.35",
    symbol: "eth"
  },
]

export const teamData = [
  {
    image: Tron1,
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    mail: "mailto:example@biples.com",
    name: "Caligula",
    role: "Founder"
  },
  {
    image: Tron2,
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    mail: "mailto:example@biples.com",
    name: "Weishein Raidmaster",
    role: "3D Designer & Art Derector"
  },
  {
    image: Tron3,
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    mail: "mailto:example@biples.com",
    name: "Caligula",
    role: "Founder"
  },
  {
    image: Tron4,
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    mail: "mailto:example@biples.com",
    name: "Weishein Raidmaster",
    role: "3D Designer & Art Derector"
  },
  {
    image: Tron5,
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    mail: "mailto:example@biples.com",
    name: "Caligula",
    role: "Founder"
  },
  {
    image: Tron6,
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    mail: "mailto:example@biples.com",
    name: "Weishein Raidmaster",
    role: "3D Designer & Art Derector"
  },
]

export const storeData = [
  {
    image: Tron1,
    type: "Item",
    name: "T-shirt TRON",
    cost: 5000
  },
  {
    image: Tron1,
    type: "Item",
    name: "T-shirt TRON",
    cost: 5000
  },
  {
    image: Tron1,
    type: "Item",
    name: "T-shirt TRON",
    cost: 5000
  },
  {
    image: Tron1,
    type: "Item",
    name: "T-shirt TRON",
    cost: 5000
  },
  {
    image: Tron1,
    type: "Item",
    name: "T-shirt TRON",
    cost: 5000
  },
  {
    image: Tron1,
    type: "Item",
    name: "T-shirt TRON",
    cost: 5000
  },
  {
    image: Tron1,
    type: "Item",
    name: "T-shirt TRON",
    cost: 5000
  },
  {
    image: Tron1,
    type: "Item",
    name: "T-shirt TRON",
    cost: 5000
  },
  {
    image: Tron1,
    type: "Item",
    name: "T-shirt TRON",
    cost: 5000
  },

]

export const voiceRoomData = {
  name: "AMA August #13",
  live: true,
  speakers: [
    {
      name: "Speaker name",
      image: Tron1
    },
    {
      name: "Speaker name",
      image: Tron2
    },
    {
      name: "Speaker name",
      image: Tron3
    },
    {
      name: "Speaker name",
      image: Tron4
    },
  ],
  listeners: [
    {
      name: "Listener name",
      image: Tron1
    },
    {
      name: "Listener name",
      image: Tron2
    },
    {
      name: "Listener name",
      image: Tron3
    },
    {
      name: "Listener name",
      image: Tron4
    },
    {
      name: "Listener name",
      image: Tron5
    },
    {
      name: "Listener name",
      image: Tron6
    },
    {
      name: "Listener name",
      image: Tron7
    },
    {
      name: "Listener name",
      image: Tron8
    },
    {
      name: "Listener name",
      image: Tron9
    },
    {
      name: "Listener name",
      image: Tron10
    },
    {
      name: "Listener name",
      image: Tron1
    },
    {
      name: "Listener name",
      image: Tron2
    },
    {
      name: "Listener name",
      image: Tron3
    },
    {
      name: "Listener name",
      image: Tron4
    },
  ]
}