import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Button from "./button";
import "@testing-library/jest-dom";

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ success: true }) })) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("ActionButton", () => {
  it("makes a POST request with userId when clicked", async () => {
    render(<Button userId="2" />);

    const button = screen.getByRole("button", { name: /Assign/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/shopper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "2" }),
      });
    });
  });
});
