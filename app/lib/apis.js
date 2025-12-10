import { createApi } from "./createApi";
import {
  API_BASE_URL,
  AUTH_SERVER,
  EMAIL_SERVER,
  WHATSAPP_SERVER,
  AI_MODEL_SERVER,
} from "@/app/constant/constant"; // ✅ NO CHANGE TO constant.js

export const coreApi = createApi(API_BASE_URL);
export const authApi = createApi(AUTH_SERVER);
export const emailApi = createApi(EMAIL_SERVER);
export const whatsappApi = createApi(WHATSAPP_SERVER);
export const aiApi = createApi(AI_MODEL_SERVER);
