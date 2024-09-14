export interface ConnectionState {
    databaseEngine: string;
    user: string;
    host: string;
    password: string;
    port: string;
    dbName?: string;
    serverType?: string;
    serverName?: string;
  }

export interface Params {
    dbType: string;
    host: string;
    user: string;
    password: string;
    database: string;
    port: string;
  }

