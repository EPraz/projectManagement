import { render, screen } from "@testing-library/react";
import Portal from "../Portal";

describe("Portal Component", () => {
  it("match snapshot", async () => {
    const { asFragment } = render(
      <Portal>
        <div data-testid="portal-content">Portal Content</div>
      </Portal>
    );
    expect(asFragment).toMatchSnapshot();
  });

  it("renders children into document.body", () => {
    render(
      <Portal>
        <div data-testid="portal-content">Portal Content</div>
      </Portal>
    );

    const content = screen.getByTestId("portal-content");
    expect(content).toBeInTheDocument();
    expect(document.body).toContainElement(content);
  });
});
