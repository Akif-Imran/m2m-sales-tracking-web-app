import React, { useState } from "react";
import { Center, Container, Stack, Text } from "@mantine/core";
import { colors } from "@theme";
import TopBarProgress from "react-topbar-progress-indicator";
import { notify } from "@utility";

import * as authHelpers from "./AuthHelpers";
import { selectUsers, useAppSelector } from "@store";

/* interface UserContextType {
  isAuthorized: boolean;
  setAuth: Dispatch<React.SetStateAction<boolean>>;
  isLoggingIn: boolean;
  token: string;
  setToken: Dispatch<React.SetStateAction<string>>;
  userData: UserData | null;
  setUserData: Dispatch<React.SetStateAction<UserData | null>>;
  logout: (removeCredentials: boolean) => void;
  login: (email: string, password: string, save: boolean) => Promise<void>;
  updateUserCompany: (company: CompanyResponseObject) => void;
}
const UserContext = createContext<UserContextType>({
  isAuthorized: false,
  setAuth: () => {},
  isLoggingIn: false,
  token: "",
  setToken: () => {},
  userData: null,
  setUserData: () => {},
  logout: (removeCredentials: boolean) => {},
  login: async (email: string, password: string, save: boolean) => {},
  updateUserCompany: (company) => {},
});

interface UserProviderProps {}

const UserProvider: React.FC<React.PropsWithChildren<UserProviderProps>> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const logout = (removeCredentials: boolean): void => {
    setIsAuthorized(false);
    setToken("");
    setUserData(null);
    authHelpers.removeAuth();
  };

  const login = async (email: string, password: string, save: boolean) => {
    setIsLoggingIn(true);
    apiLogin({
      email: email,
      password: password,
    })
      .then((res) => {
        notify("Login", res?.message || "N/A", res.success ? "success" : "error");
        if (res.success) {
          setUserData(res.data);
          setToken(res.token);
          setIsAuthorized(true);
          if (save) {
            authHelpers.setAuth({ ...res.data, token: res.token });
          }
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  const updateUserCompany = (company: CompanyResponseObject) => {
    setUserData((prev) => {
      if (!prev) return null;
      return { ...prev, company: company };
    });
  };

  return (
    <UserContext.Provider
      value={{
        isAuthorized,
        setAuth: setIsAuthorized,
        isLoggingIn: isLoggingIn,
        token,
        setToken,
        userData,
        setUserData,
        logout,
        login,
        updateUserCompany,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useAuthContext = () => useContext(UserContext); */
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string, save: boolean) => void;
  logout: () => void;
}

interface AuthState {
  isAuthorized: boolean;
  isLoading: boolean;
  token: string;
  user: ILoginUserData | null;
  isAdmin: boolean;
  isSales: boolean;
  isEngineer: boolean;
}

type AuthAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_STOP" }
  | { type: "LOGOUT" }
  | {
      type: "LOGIN";
      payload: { token: string; user: ILoginUserData; save: boolean };
    }
  | {
      type: "GIVE_ACCESS";
      payload: { isAuthorized: boolean; token: string; user: ILoginUserData };
    };

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOAD_STOP":
      return {
        ...state,
        isLoading: false,
      };
    case "LOGOUT":
      authHelpers.removeAuth().then();
      return {
        ...state,
        token: "",
        user: null,
        isAuthorized: false,
        isLoading: false,
        isAdmin: false,
        isEngineer: false,
        isSales: false,
      };
    case "LOGIN":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAdmin: action.payload.user.userTypeName === "Admin",
        isSales: action.payload.user.userTypeName === "Sales",
        isEngineer: action.payload.user.userTypeName === "Engineer",
        isAuthorized: true,
        isLoading: false,
      };
    case "GIVE_ACCESS":
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthorized: true,
        isAdmin: action.payload.user.userTypeName === "Admin",
        isSales: action.payload.user.userTypeName === "Sales",
        isEngineer: action.payload.user.userTypeName === "Engineer",
      };
    default:
      return state;
  }
};

const initAuthState: AuthState = {
  isAuthorized: false,
  isLoading: true, // note that this is now true
  token: "",
  user: null,
  isAdmin: false,
  isEngineer: false,
  isSales: false,
};

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initAuthState);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const { data: users } = useAppSelector(selectUsers);

  React.useEffect(() => {
    (async () => {
      try {
        const auth = await authHelpers.getAuth();
        if (!auth) {
          dispatch({ type: "LOGOUT" });
          return;
        } else {
          dispatch({
            type: "GIVE_ACCESS",
            payload: {
              isAuthorized: true,
              user: auth.user,
              token: auth.token,
            },
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({ type: "LOGOUT" });
      } finally {
        setShowSplashScreen(false);
      }
    })();
  }, []);

  // React.useEffect(() => {
  //   if (state.isAuthorized) {
  //     authHelpers.setupAxios(axios);
  //   }
  // }, [state.isAuthorized]);

  const logout = React.useCallback(() => dispatch({ type: "LOGOUT" }), []);

  const login = React.useCallback(
    (email: string, password: string, save: boolean) => {
      dispatch({ type: "LOAD_START" });
      const user = users.find((user) => user.email === email && user.password === password);
      if (!user) {
        notify("Login", "Invalid username or password", "error");
        dispatch({ type: "LOAD_STOP" });
        return;
      } else {
        if (save) {
          authHelpers.setAuth({ token: "", user: user }).then(() => {
            dispatch({
              type: "LOGIN",
              payload: { user: user, save: true, token: "" },
            });
          });
        } else {
          dispatch({
            type: "LOGIN",
            payload: { user: user, save: false, token: "" },
          });
        }
      }

      dispatch({ type: "LOAD_STOP" });
    },
    [users]
  );

  const value = React.useMemo(() => ({ state, login, logout }), [state, login, logout]);

  return showSplashScreen ? (
    <>
      <TopBarProgress />
      <Container>
        <Center>
          <Stack>
            <Text color={colors.titleText}>Loading...</Text>
          </Stack>
        </Center>
      </Container>
    </>
  ) : (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

/* interface AuthInitProps {}
const AuthInit: React.FC<PropsWithChildren<AuthInitProps>> = ({ children }) => {
  const {} = useAuthContext();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  React.useEffect(() => {
    const requestAuth = async () => {
      const user = authHelpers.getAuth();
      if (user) {
        setToken(user.token);
        setUserData(user);
        setAuth(true);
      }
    };
    requestAuth()
      .catch((err) => {
        console.log("Auth Init Error");
      })
      .finally(() => {
        setShowSplashScreen(false);
      });
  }, []);

  return showSplashScreen ? (
    <>
      <TopBarProgress />
      <Container>
        <Center>
          <Stack>
            <Text color={colors.titleText}>Loading...</Text>
          </Stack>
        </Center>
      </Container>
    </>
  ) : (
    <>{children}</>
  );
}; */

export { AuthProvider };
// eslint-disable-next-line react-refresh/only-export-components
export { useAuthContext };
