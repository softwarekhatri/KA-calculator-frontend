import { metalType } from "./utils/types";

export interface ItemVariant {
  _id?: string;
  name: string;
  tunch: number;
  addOnPrice: number;
  makingCharge: number;
  variant: metalType;
}
