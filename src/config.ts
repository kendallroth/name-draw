// @ts-ignore
import { version } from "../package.json";

interface WebAppConfig {
  /** App environment name */
  envName: string;
  /** Whether app is deployed in production environment */
  production: boolean;
  /** Web app version */
  version: string;
}

const webConfig: WebAppConfig = {
  envName: (import.meta.env.VITE_ENV_NAME as string) ?? "local",
  production: import.meta.env.NODE_ENV === "production",
  version,
};

export default webConfig;
