import ReactDOM from "react-dom";
import { PageContent } from "../layout/Layout.styles";
import { PortalProps } from "../../types";

const Portal = ({ children }: PortalProps) => {
  return ReactDOM.createPortal(
    <PageContent>{children}</PageContent>,
    document.body
  );
};

export default Portal;
