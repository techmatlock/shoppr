import { useContext } from "react";
import { UserContext, UserContextValues } from "./UserContext";

export function useUser(): UserContextValues {
  const values = useContext(UserContext);
  if (!values) throw new Error("useItems must be used inside a ItemsProvider");
  return values;
}
