import { useItems } from "./useItems";
const { checkIfNeedExists } = useItems();

describe("checkIfNeedExists", () => {
  test("A userId and shoppingItemId should return true", () => {
    expect(checkIfNeedExists(2, 1)).toBe(true);
  });
});
