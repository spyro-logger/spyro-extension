import SettingsUtility from '../../utils/SettingsUtility';
import sampleSettings from '../testdata/SampleSettings';

describe('SettingsUtility', () => {
  it('successfully retrieves the Jira settings for the provided key', () => {
    const expectedInstance = sampleSettings.shared.jira.instances[1];
    const actualInstance = SettingsUtility.getJiraInstanceByKey(sampleSettings, 'jira2');
    expect(actualInstance).toBe(expectedInstance);
  });

  it('successfully retrieves the Splunk settings for the provided key', () => {
    const expectedInstance = sampleSettings.shared.splunk.instances[1];
    const actualInstance = SettingsUtility.getSplunkInstanceByKey(sampleSettings, 'splunk2');
    expect(actualInstance).toEqual(expectedInstance);
  });
});
