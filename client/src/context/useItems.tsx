import { useContext } from "react";
import { ItemsContext, ItemsContextValues } from "./ItemsContext";

export function useItems(): ItemsContextValues {
  const values = useContext(ItemsContext);
  if (!values) throw new Error("useItems must be used inside a ItemsProvider");
  return values;
}
