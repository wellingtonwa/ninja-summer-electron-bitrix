import Store from 'electron-store';

class StoreService extends Store {
  constructor() {
    super();
  }
}

export default new StoreService();