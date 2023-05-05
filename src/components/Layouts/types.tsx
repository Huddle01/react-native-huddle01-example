export interface ILayoutProps {
  peers: object;
  me: object;
  viewportBgColor: string;
  peerNameColor: string;
  renderBottomTool?: () => JSX.Element;
}
