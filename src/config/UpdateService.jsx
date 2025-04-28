import axios from 'axios';

export class UpdateService {
  static async checkForUpdates() {
    try {
      const response = await axios.post('https://men4u.xyz/common_api/check_version', {
        app_type: "Statistics"
      });

      console.log('Version check response:', response.data);

      if (response.data.st === 1) {
        const currentVersion = '1.2'; // Hardcoded current version
        const serverVersion = response.data.version;

        console.log('Versions:', { current: currentVersion, server: serverVersion });

        // Check if versions are exactly equal
        const hasUpdate = currentVersion !== serverVersion;
        console.log('Update required:', hasUpdate);

        return {
          hasUpdate,
          currentVersion,
          serverVersion
        };
      }

      return { 
        hasUpdate: false,
        error: 'Invalid server response'
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      return { 
        hasUpdate: false, 
        error: error.message,
        currentVersion: '1.2',
        serverVersion: 'Unknown'
      };
    }
  }

  static isValidVersion(version) {
    if (!version) return false;
    const versionRegex = /^\d+\.\d+\.\d+$/;
    return versionRegex.test(version);
  }

  static compareVersions(current, server) {
    if (!current || !server) return false;
    return current !== server; // Return true if versions are different
  }
}
