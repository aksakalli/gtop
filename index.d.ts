declare module 'gtop' {
  export interface Config {
    updateIntervals: {
      cpu: number;
      memory: number;
      network: number;
      disk: number;
      process: number;
    };
    theme: string;
    colors: string[];
    monitors: {
      cpu: boolean;
      memory: boolean;
      network: boolean;
      disk: boolean;
      process: boolean;
    };
    export: {
      enabled: boolean;
      format: 'json' | 'csv' | 'prometheus';
      path: string;
      interval: number;
    };
    processFilter: string;
    keybindings: {
      quit: string[];
      sortByPid: string;
      sortByCpu: string;
      sortByMem: string;
      search: string;
      export: string;
    };
  }

  export interface Monitor {
    cleanup(): void;
    updateData(data: any): void;
  }

  export class Cpu implements Monitor {
    constructor(line: any);
    cleanup(): void;
    updateData(data: any): void;
    cpuData: Array<{
      title: string;
      style: { line: string };
      x: number[];
      y: number[];
    }>;
  }

  export class Mem implements Monitor {
    constructor(line: any, memDonut: any, swapDonut: any);
    cleanup(): void;
    updateData(data: any): void;
    memData: any[];
    swapData: any[];
  }

  export class Net implements Monitor {
    constructor(sparkline: any);
    cleanup(): void;
    updateData(data: any): void;
    netData: [number[], number[]];
  }

  export class Disk implements Monitor {
    constructor(donut: any);
    cleanup(): void;
    updateData(data: any): void;
    diskData: any;
  }

  export class Proc implements Monitor {
    constructor(table: any);
    cleanup(): void;
    updateData(data: any): void;
    searchTerm: string;
    allData: any[];
  }

  export interface Utils {
    humanFileSize(bytes: number, isDecimal?: boolean): string;
    colors: string[];
  }

  export interface Exporter {
    init(monitors: Monitor[]): void;
    export(format?: 'json' | 'csv' | 'prometheus'): void;
    cleanup(): void;
  }

  export const monitor: {
    Cpu: typeof Cpu;
    Mem: typeof Mem;
    Net: typeof Net;
    Disk: typeof Disk;
    Proc: typeof Proc;
  };

  export const utils: Utils;
  export const config: Config;
  export const exporter: Exporter;

  export function init(): void;
}