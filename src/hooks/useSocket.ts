import { useAuthContext } from "@contexts";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = (url: string) => {
  const {
    state: { token },
  } = useAuthContext();
  const [server, setServer] = useState<SocketIOClient.Socket | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (!isConnected) {
      console.log("connecting...");
      const server = io.connect(url);
      server.on("authenticated", () => {
        console.log("hook socket authenticated");
      });
      server.on("connect", () => {
        console.log("connected fired");
        setIsConnected(true);
        server.emit("authenticate", {
          token: `${token}`,
        });
      });

      server.emit("authenticate", {
        token: `${token}`,
      });
      setServer(server);
    } else {
      console.log("already connected");
    }

    return () => {
      console.log("1st useEffect useSocket return");
      setIsConnected(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (server === undefined) return;
    console.log("useSocket hook adding event listeners");

    server.on("disconnect", (reason: string) => {
      console.log("hook server disconnected. reason = ", reason);
      setIsConnected(false);
    });
    server.on("connect_error", () => {
      console.log("hook connection error");
    });

    return () => {
      console.log("2st useEffect useSocket return");
      server?.off("connect_error");
      server?.off("disconnect");
      setIsConnected(false);
    };
  }, [server]);

  return server;
};

export default useSocket;
