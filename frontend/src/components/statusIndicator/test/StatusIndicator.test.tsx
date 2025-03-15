// StatusIndicator.test.tsx
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatusIndicator } from "../StatusIndicator";

describe("StatusIndicator", () => {
  it("match snapshot", () => {
    const { asFragment } = render(
      <StatusIndicator status="active" color="red" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders a span with the correct background color", () => {
    // Renderizamos el componente con un color específico
    const { container } = render(
      <StatusIndicator status="active" color="red" />
    );
    const spanElement = container.firstChild;
    expect(spanElement).toBeInTheDocument();
    // Verifica que el estilo se haya aplicado correctamente.
    expect(spanElement).toHaveStyle("background-color: red");
  });
});
