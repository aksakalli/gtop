const utils = require('./utils');

describe('utils', () => {
  describe('humanFileSize', () => {
    it('should handle zero bytes', () => {
      expect(utils.humanFileSize(0)).toBe('0.00 B');
      expect(utils.humanFileSize(0, true)).toBe('0.00 B');
    });

    it('should handle negative numbers', () => {
      expect(utils.humanFileSize(-100)).toBe('0.00 B');
    });

    it('should handle invalid input', () => {
      expect(utils.humanFileSize(null)).toBe('0.00 B');
      expect(utils.humanFileSize(undefined)).toBe('0.00 B');
      expect(utils.humanFileSize('string')).toBe('0.00 B');
      expect(utils.humanFileSize({})).toBe('0.00 B');
    });

    it('should format bytes correctly', () => {
      expect(utils.humanFileSize(512)).toBe('512.00  B');
      expect(utils.humanFileSize(1024)).toBe('1.00 KiB');
      expect(utils.humanFileSize(1048576)).toBe('1.00 MiB');
      expect(utils.humanFileSize(1073741824)).toBe('1.00 GiB');
    });

    it('should handle decimal format', () => {
      expect(utils.humanFileSize(1000, true)).toBe('1.00 KB');
      expect(utils.humanFileSize(1000000, true)).toBe('1.00 MB');
      expect(utils.humanFileSize(1000000000, true)).toBe('1.00 GB');
    });

    it('should handle large numbers', () => {
      expect(utils.humanFileSize(1099511627776)).toBe('1.00 TiB');
      // Due to clamping, very large numbers will show as TiB
      expect(utils.humanFileSize(1125899906842624)).toBe('1024.00 TiB');
    });
  });

  describe('colors', () => {
    it('should export an array of colors', () => {
      expect(Array.isArray(utils.colors)).toBe(true);
      expect(utils.colors.length).toBe(6);
      expect(utils.colors).toEqual(['magenta', 'cyan', 'blue', 'yellow', 'green', 'red']);
    });
  });
});