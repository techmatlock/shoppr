import { getInitials } from "./data";

describe("Get initials", () => {
  test("Mark Daniels should result in MD", () => {
    expect(getInitials("Mark Daniels")).toBe("MD");
  });
});
