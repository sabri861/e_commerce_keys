import {Identity} from "../../../core/domain/Identity";
import { Request } from "express";

export interface AuthenticatedRequest  {
    req?: Request;
    identity?: Identity;
}
