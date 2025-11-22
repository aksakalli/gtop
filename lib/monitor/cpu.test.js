const Cpu = require('./cpu');

// Mock systeminformation
jest.mock('systeminformation', () => ({
  currentLoad: jest.fn()
}));

// Mock blessed components
const mockLine = {
  setData: jest.fn(),
  screen: {
    render: jest.fn()
  }
};

describe('Cpu Monitor', () => {
  let cpu;
  const si = require('systeminformation');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    if (cpu && cpu.cleanup) {
      cpu.cleanup();
    }
    jest.useRealTimers();
  });

  it('should initialize with CPU data', () => {
    const mockData = {
      cpus: [
        { load: 25.5 },
        { load: 30.2 }
      ]
    };

    si.currentLoad.mockImplementation((callback) => {
      callback(mockData);
    });

    cpu = new Cpu(mockLine);

    expect(si.currentLoad).toHaveBeenCalled();
    expect(mockLine.setData).toHaveBeenCalled();
    expect(mockLine.screen.render).toHaveBeenCalled();
  });

  it('should handle missing CPU data gracefully', () => {
    si.currentLoad.mockImplementation((callback) => {
      callback(null);
    });

    cpu = new Cpu(mockLine);

    expect(si.currentLoad).toHaveBeenCalled();
    // Should not crash
  });

  it('should update data periodically', () => {
    const mockData = {
      cpus: [{ load: 25.5 }]
    };

    si.currentLoad.mockImplementation((callback) => {
      callback(mockData);
    });

    cpu = new Cpu(mockLine);
    
    // Clear initial calls
    jest.clearAllMocks();

    // Fast-forward time by 1 second
    jest.advanceTimersByTime(1000);

    expect(si.currentLoad).toHaveBeenCalled();
  });

  it('should cleanup interval on cleanup', () => {
    const mockData = {
      cpus: [{ load: 25.5 }]
    };

    si.currentLoad.mockImplementation((callback) => {
      callback(mockData);
    });

    cpu = new Cpu(mockLine);
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    cpu.cleanup();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('should handle invalid CPU data in updateData', () => {
    const mockData = {
      cpus: [{ load: 25.5 }]
    };

    si.currentLoad.mockImplementation((callback) => {
      callback(mockData);
    });

    cpu = new Cpu(mockLine);

    // Test with various invalid data
    cpu.updateData(null);
    cpu.updateData({});
    cpu.updateData({ cpus: null });
    cpu.updateData({ cpus: [] });

    // Should not crash
  });
});