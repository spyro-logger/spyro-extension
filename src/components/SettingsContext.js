import React, { useState, useEffect, useCallback } from 'react';

import Storage from '../utils/Storage';
import { APPLICATION_NAME } from '../ApplicationConstants';
import useInterval from '../hooks/useInterval';

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

  const saveSettings = (settingsToSave) => {
    setSettings(settingsToSave);
    Storage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settingsToSave));
  };

  const saveSettingsRepositoryUrl = (repositoryUrlToSave) => {
    setSettingsRepositoryUrl(repositoryUrlToSave);
    Storage.setItem(LOCAL_STORAGE_SETTINGS_REPOSITORY_URL_KEY, repositoryUrlToSave);
  };

  const initializeSettings = useCallback(async () => {
    setSettingsFetchErrorOccurred(false);

    if (settingsRepositoryUrl) {
      fetch(settingsRepositoryUrl)
        .then((response) => response.json())
        .then(saveSettings)
        .catch((error) => {
          console.error('Error fetching settings', error);
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
    },
    statuses: {
      settingsFetchErrorOccurred,
    },
  };

  if (typeof props.children === 'function') {
    return <SettingsContext.Provider value={contextValue}>{props.children(contextValue)}</SettingsContext.Provider>;
  }

  return <SettingsContext.Provider value={contextValue}>{props.children}</SettingsContext.Provider>;
};

/**
 * Gate for preventing rendering before data has been pulled from possibly async Storage.
 */
const WaitForInitialValuesGate = (settingsContextProviderProps) => {
  const [settingsRepositoryUrl, setSettingsRepositoryUrl] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettingsFromStorage = async () => {
      const settingsRepositoryUrlFromStorage = await Storage.getItem(LOCAL_STORAGE_SETTINGS_REPOSITORY_URL_KEY);
      const settingsFromStorage = await Storage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      const initialSettingsRepositoryUrl = settingsRepositoryUrlFromStorage || '';
      const initialSettings = JSON.parse(settingsFromStorage) || {};
      setSettingsRepositoryUrl(initialSettingsRepositoryUrl);
      setSettings(initialSettings);
    };

    fetchSettingsFromStorage();
  }, []);

  if (!settings) {
    return null;
  }

  const initialValues = {
    settingsRepositoryUrl: () => settingsRepositoryUrl,
    settings: () => settings,
  };

  return <SettingsContextProvider {...settingsContextProviderProps} initialValues={initialValues} />;
};

export { SettingsContext, WaitForInitialValuesGate as SettingsContextProvider };
