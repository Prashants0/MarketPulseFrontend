import { connect } from "socket.io-client";
import { BACKEND_URL } from "./utils";

export const serverSocket = connect(BACKEND_URL!);
