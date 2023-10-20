import React from "react";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider, rem } from "@mantine/core";
import { AuthProvider } from "@contexts";
import { MainApp } from "@routes";
import { _DataLoader } from "@components";
import { colors } from "@theme";

type PrimaryColorChoice =
  | "primary"
  | "dark"
  | "gray"
  | "red"
  | "pink"
  | "grape"
  | "violet"
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "green"
  | "lime"
  | "yellow"
  | "orange";
interface ThemeColorContext {
  setColor: React.Dispatch<React.SetStateAction<PrimaryColorChoice>>;
  color: PrimaryColorChoice;
}
const ThemeColorContext = React.createContext<ThemeColorContext>({
  setColor: () => {},
  color: "primary",
});

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeColorContext = () => React.useContext(ThemeColorContext);

function App() {
  const [primaryColor, setPrimaryColor] = React.useState<PrimaryColorChoice>("dark");
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      withCSSVariables
      theme={{
        components: {
          Modal: {
            styles: {
              title: {
                fontWeight: "bold",
                fontSize: rem(20),
                color: colors.titleText,
              },
            },
          },
        },
        colorScheme: "light",
        colors: {
          primary: [
            "#EBFBEE",
            "#D3F9D8",
            "#B2F2BB",
            "#8CE99A",
            "#69DB7C",
            "#51CF66",
            "#00C853", //used as primary
            "#37B24D",
            "#2F9E44",
            "#2B8A3E",
          ],
        },
        primaryColor: primaryColor,
        focusRing: "never",
      }}
    >
      <Notifications position="top-right" zIndex={2077} />
      <DatesProvider settings={{ locale: "en-US" }}>
        <ThemeColorContext.Provider value={{ setColor: setPrimaryColor, color: primaryColor }}>
          <ModalsProvider>
            <AuthProvider>
              {/* <AuthInit>
                <DevicesReducerProvider>
                  <DevicesProvider>
                    <AllUsersProvider>
                      <OperatorsProvider>
                        <ServicesProvider>
                          <AlarmDescProvider> */}
              <_DataLoader>
                <MainApp />
              </_DataLoader>
              {/* </AlarmDescProvider>
                        </ServicesProvider>
                      </OperatorsProvider>
                    </AllUsersProvider>
                  </DevicesProvider>
                </DevicesReducerProvider>
              </AuthInit> */}
            </AuthProvider>
          </ModalsProvider>
        </ThemeColorContext.Provider>
      </DatesProvider>
    </MantineProvider>
  );
}

export default App;
