import { createContext } from "react";

export const UserContext = createContext(null);
// creating Provider and Consumer and exporting them.

export const UserProvider = UserContext.Provider

export const UserConsumer = UserContext.Consumer