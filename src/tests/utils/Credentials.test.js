import Credentials from '../../main/utils/Credentials';
import ApplicationConstants from '../../main/ApplicationConstants';

const { APPLICATION_NAME } = ApplicationConstants;
const LOCAL_STORAGE_CREDENTIALS_KEY = `${APPLICATION_NAME}Credentials`;

const credential1 = {
  username: 'username1',
  password: 'password1',
  associatedTo: ['instance1'],
};

const credential2 = {
  username: 'username2',
  password: 'password2',
  associatedTo: ['instance2'],
};

/* eslint-disable no-underscore-dangle */
describe('Credentials API', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows adding new credentials', async () => {
    await Credentials.addEntry(credential1);
    expect(JSON.parse(localStorage.__STORE__[LOCAL_STORAGE_CREDENTIALS_KEY])).toEqual([credential1]);
  });

  describe('getAllEntries', () => {
    it('allows retrieving all stored credentials', async () => {
      await Credentials.addEntry(credential1);
      await Credentials.addEntry(credential2);
      const allCredentials = await Credentials.getAllEntries();
      expect(allCredentials).toEqual([credential1, credential2]);
    });

    it('returns an empty array if there are no stored credentials', async () => {
      const allCredentials = await Credentials.getAllEntries();
      expect(allCredentials).toEqual([]);
    });
  });

  describe('getEntryByKey', () => {
    it('rejects the promise if no credential for the specified key is found', async () => {
      expect.assertions(1);
      await Credentials.addEntry(credential1);
      await Credentials.addEntry(credential2);
      const instanceToFind = 'NOT_SPECIFIED_CREDENTIAL';
      await expect(Credentials.getEntryByKey(instanceToFind)).rejects.toEqual(new Error('No credential found'));
    });

    it('resolves the expected credential for a valid key', async () => {
      await Credentials.addEntry(credential1);
      await Credentials.addEntry(credential2);
      const instanceToFind = credential2.associatedTo[0];
      const credential = await Credentials.getEntryByKey(instanceToFind);
      expect(credential).toEqual(credential2);
    });
  });
});
