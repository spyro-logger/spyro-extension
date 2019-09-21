import ApplicationConstants from '../ApplicationConstants';
import Storage from './Storage';

const { APPLICATION_NAME } = ApplicationConstants;

const LOCAL_STORAGE_CREDENTIALS_KEY = `${APPLICATION_NAME}Credentials`;

/**
 * Utility for retrieving saved credentials from storage. The credential retrieved will match the following structure:
 *
 * @typedef CredentialInfo
 * @type {object}
 * @property {string} username - The username of the credential
 * @property {string} password - The password of the credential
 * @property {string[]} associatedTo - The instances (Splunk or Jira) that the credential is associated to
 */
const Credentials = {
  /**
   * Adds a credential to save to storage.
   *
   * @param {CredentialInfo} credentialToAdd
   *    The credential to add
   * @returns {Promise}
   *    A promise that resolves when the credential is saved to storage.
   */
  addEntry: async (credentialToAdd) => {
    const credentialsFromStorage = await Storage.getItem(LOCAL_STORAGE_CREDENTIALS_KEY);
    const parsedCredentials = credentialsFromStorage ? JSON.parse(credentialsFromStorage) : [];

    const updatedCredentials = [...parsedCredentials, credentialToAdd];
    return Storage.setItem(LOCAL_STORAGE_CREDENTIALS_KEY, JSON.stringify(updatedCredentials));
  },

  /**
   * Retrieves all of the credentials currently in storage.
   *
   * @returns {Promise<CredentialInfo[] | []>}
   *    A promise that resolves with all of the credentials in storage. If there are no credentials, resolves with an
   *    empty list.
   */
  getAllEntries: async () => {
    const credentialsFromStorage = await Storage.getItem(LOCAL_STORAGE_CREDENTIALS_KEY);
    return credentialsFromStorage ? JSON.parse(credentialsFromStorage) : [];
  },

  /**
   * Retrieves the credential that is associated to the specified instance key.
   *
   * @param {string} instanceKey
   *    The instance to retrieve the credential for.
   * @returns {Promise<CredentialInfo>}
   *    A promise that resolves with the credential associated to the specified instance key. If a matching credential
   *    cannot be found, the function rejects the promise.
   */
  getEntryByKey: async (instanceKey) => {
    return new Promise((resolve, reject) => {
      Credentials.getAllEntries().then((credentialsFromStorage) => {
        const matchingCredential = credentialsFromStorage.find((credential) =>
          credential.associatedTo.includes(instanceKey),
        );

        if (!matchingCredential) {
          reject(new Error('No credential found'));
        }

        resolve(matchingCredential);
      });
    });
  },
};

export default Credentials;
