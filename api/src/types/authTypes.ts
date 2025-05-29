import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface KeyHeader {
    kid: string;
}

export interface SigningKey {
    getPublicKey(): string;
}

export type GetKeyCallback = (err: Error | null, key?: string) => void;

export interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

export interface VerifyOptions {
    audience: string;
    issuer: string;
    algorithms: string[];
}