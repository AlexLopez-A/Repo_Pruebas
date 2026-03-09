// Types for the EXT2 File System Simulator

export interface CommandResponse {
  success: boolean;
  message: string;
  output: string;
  reportPath?: string;
  reportDot?: string;
}

export interface MountedPartition {
  id: string;
  diskPath: string;
  partitionName: string;
  status: string;
}

export interface ConsoleEntry {
  id: number;
  type: 'command' | 'output' | 'error' | 'comment' | 'info';
  content: string;
  timestamp: Date;
}

export interface ReportData {
  id: string;
  name: string;
  type: string;
  dot?: string;
  svg?: string;
  imagePath?: string;
}
