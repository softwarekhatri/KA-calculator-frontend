export interface IPriceData {
  type: metalType;
  price: number;
}

export type metalType = "GOLD" | "SILVER";

export type makingChargeType = "PER_GRAM" | "FIXED";
