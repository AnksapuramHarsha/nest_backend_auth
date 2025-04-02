export interface JwtPayload {
    id: string;
    email: string;
    organizationId?: string;
    networkId?: string;
    roles?: string[];
  }