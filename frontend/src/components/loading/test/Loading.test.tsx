import { render, screen } from "@testing-library/react";
import Loading from "../Loading";

describe("Loading Component", () => {
  it("match snapshot", async () => {
    const { asFragment } = render(
      <Loading variant="minimal" message="Loading minimal..." />
    );
    expect(asFragment).toMatchSnapshot();
  });

  it("renders minimal variant correctly", () => {
    render(<Loading variant="minimal" message="Loading minimal..." />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(screen.getByText("Loading minimal...")).toBeInTheDocument();
  });

  it("renders default variant correctly", () => {
    render(
      <Loading
        variant="default"
        message="Default Loading"
        description="Please wait while content loads"
      />
    );
    expect(screen.getByText("Default Loading")).toBeInTheDocument();
    expect(
      screen.getByText("Please wait while content loads")
    ).toBeInTheDocument();
    const dots = document.querySelectorAll(".dot");
    expect(dots.length).toBe(3);
  });

  it("renders fullscreen variant with proper height", () => {
    const { container } = render(
      <Loading
        variant="fullscreen"
        message="Fullscreen Loading"
        description="Please wait..."
      />
    );
    const loadingContainer = container.firstChild;
    expect(loadingContainer).toHaveStyle("height: 100vh");
  });
});
