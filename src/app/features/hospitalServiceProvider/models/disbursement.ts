export interface Disbursement {
  id: number;
  disbursementDateMonth: Date;  // Using Date instead of DateOnly for Angular
  totalAmount: number;
  generatedAt: Date;
  paymentMethod: string;
  assetName: string;
}
export interface DisbursementListResponse {
  items: Disbursement[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
