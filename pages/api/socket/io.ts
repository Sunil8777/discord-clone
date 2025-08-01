import { Server as SocketIOServer } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIo } from "../../../types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer = res.socket.server as any 

    const io = new SocketIOServer(httpServer, {
      path,
      addTrailingSlash: false,
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
