export interface HeaderProps {
  projectName: string;
  projectId: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}
