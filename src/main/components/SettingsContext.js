import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Storage from '../utils/Storage';
import ApplicationConstants from '../ApplicationConstants';
import useInterval from '../hooks/useInterval';
import Credentials from '../utils/Credentials';

const { APPLICATION_NAME } = ApplicationConstants;
const LOCAL_STORAGE_SETTINGS_KEY = `${APPLICATION_NAME}Settings`;
const LOCAL_STORAGE_SETTINGS_REPOSITORY_URL_KEY = `${APPLICATION_NAME}SettingsRepositoryUrl`;
const MILLISECONDS_IN_ONE_MINUTE = 60000;
const POLLING_INTERVAL = 15 * MILLISECONDS_IN_ONE_MINUTE;

const SettingsContext = React.createContext({});

const SettingsContextProvider = (props) => {
  const { initialValues } = props;
  const [settingsRepositoryUrl, setSettingsRepositoryUrl] = useState(initialValues.settingsRepositoryUrl);
  const [settings, setSettings] = useState(initialValues.settings);
  const [settingsFetchErrorOccurred, setSettingsFetchErrorOccurred] = useState(false);
  const [credentials, setCredentials] = useState(initialValues.credentials);

  const saveSettings = (settingsToSave) => {
    setSettings(settingsToSave);
    Storage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settingsToSave));
  };

  const saveSettingsRepositoryUrl = (repositoryUrlToSave) => {
    setSettingsRepositoryUrl(repositoryUrlToSave);
    Storage.setItem(LOCAL_STORAGE_SETTINGS_REPOSITORY_URL_KEY, repositoryUrlToSave);
  };

  const addCredentialEntry = (credentialToAdd) => {
    Credentials.addEntry(credentialToAdd).then(setCredentials);
  };

  const removeCredentialEntry = (indexOfCredentialToRemove) => {
    Credentials.removeEntry(indexOfCredentialToRemove).then(setCredentials);
  };

  const initializeSettings = useCallback(async () => {
    setSettingsFetchErrorOccurred(false);

    if (settingsRepositoryUrl) {
      fetch(settingsRepositoryUrl)
        .then((response) => response.json())
        .then(saveSettings)
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error fetching settings', error);
          // eslint-disable-next-line no-console
          console.log(`Using cached settings`);
          setSettingsFetchErrorOccurred(true);
        });
    }
  }, [settingsRepositoryUrl]);

  // Initialize settings once
  useEffect(() => {
    initializeSettings();
  }, [initializeSettings, settingsRepositoryUrl]);

  // Poll for setting changes
  useInterval(() => {
    initializeSettings();
  }, POLLING_INTERVAL);

  const contextValue = {
    settings,
    configuration: {
      settingsRepositoryUrl,
    },
    actions: {
      setSettingsRepositoryUrl: saveSettingsRepositoryUrl,
      addCredentialEntry,
      removeCredentialEntry,
    },
    statuses: {
      settingsFetchErrorOccurred,
    },
    credentials,
  };

  if (typeof props.children === 'function') {
    return <SettingsContext.Provider value={contextValue}>{props.children(contextValue)}</SettingsContext.Provider>;
  }

  return <SettingsContext.Provider value={contextValue}>{props.children}</SettingsContext.Provider>;
};

SettingsContextProvider.propTypes = {
  initialValues: PropTypes.shape({
    settingsRepositoryUrl: PropTypes.func,
    settings: PropTypes.func,
    credentials: PropTypes.func,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
};
/**
 * Gate for preventing rendering before data has been pulled from possibly async Storage.
 */
const WaitForInitialValuesGate = (settingsContextProviderProps) => {
  const [settingsRepositoryUrl, setSettingsRepositoryUrl] = useState(null);
  const [settings, setSettings] = useState(null);
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    const fetchSettingsFromStorage = async () => {
      const settingsRepositoryUrlFromStorage = await Storage.getItem(LOCAL_STORAGE_SETTINGS_REPOSITORY_URL_KEY);
      const settingsFromStorage = await Storage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      const credentialsFromStorage = await Credentials.getAllEntries();
      try {
        const initialSettingsRepositoryUrl = settingsRepositoryUrlFromStorage || '';
        const initialSettings = JSON.parse(settingsFromStorage) || {};
        setSettingsRepositoryUrl(initialSettingsRepositoryUrl);
        setSettings(initialSettings);
        setCredentials(credentialsFromStorage);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setSettingsRepositoryUrl('');
        setSettings({});
        setCredentials([]);
      }
    };

    fetchSettingsFromStorage();
  }, []);

  if (!settings || !credentials) {
    return null;
  }

  const initialValues = {
    settingsRepositoryUrl: () => settingsRepositoryUrl,
    settings: () => settings,
    credentials: () => credentials,
  };

  const { children } = settingsContextProviderProps;
  return (
    <SettingsContextProvider {...settingsContextProviderProps} initialValues={initialValues}>
      {children}
    </SettingsContextProvider>
  );
};

export { SettingsContext, WaitForInitialValuesGate as SettingsContextProvider };
