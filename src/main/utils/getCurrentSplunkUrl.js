async function getCurrentSplunkUrlForDevelopment() {
  return Promise.resolve('');
}

async function getCurrentSplunkUrlForProduction() {
  return new Promise((resolve) => {
    const queryInfo = {
      active: true,
      currentWindow: true,
    };

    // eslint-disable-next-line no-undef
    chrome.tabs.query(queryInfo, (tabs) => {
      const { url } = tabs[0];
      resolve(url);
    });
  });
}

const getCurrentSplunkUrl =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? getCurrentSplunkUrlForDevelopment
    : getCurrentSplunkUrlForProduction;

export default getCurrentSplunkUrl;
