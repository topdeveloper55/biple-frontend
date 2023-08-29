import EventEmitter from 'events'
import sdk, { Visibility } from 'matrix-js-sdk'
import AccountData from './AccountData'
import navigation from './navigation'
import Notifications from './Notifications'
import RoomList from './RoomList'
import RoomsInput from './roomsInput'
class MatrixService extends EventEmitter {
  // let matrixClient;
  client;
  constructor() {
    super();
    navigation.initMatrix = this
  }
  async init(user) {
    await this.startClient(user)
    this.setupSync()
    this.listenEvents()
  }
  async startClient(user) {
    const baseUrl = `https://${user.home_server}`
    const accessToken = user.access_token
    const userId = user.user_id
    const deviceId = user.device_id
    const indexedDBStore = new sdk.IndexedDBStore({
      indexedDB: global.indexedDB,
      localStorage: global.localStorage,
      dbName: 'biples-matrix-store'
    })
    // await indexedDBStore.startup()
    this.matrixClient = sdk.createClient({
      baseUrl,
      accessToken,
      userId,
      deviceId,
      // store: indexedDBStore,
      // cryptoStore: new sdk.IndexedDBCryptoStore(global.indexedDB, 'crypto-store'),
      timelineSupport: true,
      // cryptoCallbacks,
      verificationMethods: [
        'm.sas.v1'
      ]
    })
    // await this.matrixClient.initCrypto()
    await this.matrixClient.startClient({
      lazyLoadMembers: true
    })
    // this.matrixClient.setGlobalErrorOnUnknownDevices(false)
    this.client = this.matrixClient
  }
  setupSync() {
    const sync = {
      NULL: () => {
        console.log('NULL state');
      },
      SYNCING: () => {
        console.log('SYNCING state');
      },
      PREPARED: (prevState) => {
        console.log('PREPARED state');
        console.log('Previous state: ', prevState)
        global.initMatrix = this;
        if (prevState === null) {
          this.roomList = new RoomList(this.matrixClient);
          this.accountData = new AccountData(this.roomList);
          this.roomsInput = new RoomsInput(this.matrixClient, this.roomList);
          this.notifications = new Notifications(this.roomList);
          this.emit('init_loading_finished');
          this.notifications._initNoti();
        } else {
          this.notifications._initNoti()
        }
      },
      RECONNECTING: () => {
        console.log('RECONNECTING state');
      },
      CATCHUP: () => {
        console.log('CATCHUP state');
      },
      ERROR: () => {
        console.log('ERROR state');
      },
      STOPPED: () => {
        console.log('STOPPED state');
      },
    };
    this.matrixClient.on('sync', (state, prevState) => sync[state](prevState));
  }

  listenEvents() {
    this.matrixClient.on('Session.logged_out', () => {
      this.matrixClient.stopClient();
      this.matrixClient.clearStores();
      window.localStorage.clear();
      window.location.reload();
    })
  }
}

const instance = new MatrixService();

export default instance;