export interface Order {
  id: number;
  areaId: number;
  joinedWith: number | null;
  sku: string;
  defaultSku: string;
  status: string;
}

export interface SeparateZones {
  [key: string]: Array<Order>;
}

export interface ChainsZone {
  [key: string]: Array<Order>;
}

export interface SeparateChain {
  [key: string]: {
    [key: string]: Array<Order>;
  };
}
