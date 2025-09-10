import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "@/routes/App";
describe("App", () => {
  it("renders header brand", () => {
    render(<App />);
    expect(screen.getByText(/Rubitech/)).toBeInTheDocument();
  });
});
