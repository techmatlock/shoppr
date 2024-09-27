import { getInitials } from "./data";
import { saveToLocalStorage } from "./localStorageUtil";

describe("Get initials", () => {
  test("Mark Daniels should result in MD", () => {
    expect(getInitials("Mark Daniels")).toBe("MD");
  });
});

describe("LocalStorage Util", () => {
  beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should save a value to localStorage", () => {
    saveToLocalStorage("um.auth", "{user: {userId: 1, username: mdaniels}, token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9}");
  });
});
