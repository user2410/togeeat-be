import { Request } from "express";
import { Socket } from "socket.io";

// guard types
export type AuthPayload = {
  userID: number;
};

export type SocketWithAuth = Socket & AuthPayload;
export type RequestWithAuth = Request & AuthPayload;