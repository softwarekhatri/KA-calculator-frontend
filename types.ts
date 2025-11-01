import { makingChargeType, metalType } from "./utils/types";

export interface ItemVariant {
  _id?: string;
  name: string;
  purchaseTunch: number;
  saleTunch: number;
  addOnPrice?: number;
  makingCharge: number;
  makingChargeType: makingChargeType;
  variant: metalType;
}
