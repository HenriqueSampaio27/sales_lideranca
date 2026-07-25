import React from "react";

export interface PaymentMethodOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface SplitPaymentItem {
  method: string;
  value: string;
}

export interface PaymentDetail {
  method: string;
  value: number;
}

export type PaymentData = PaymentDetail | PaymentDetail[];

export interface PendingAccountConfirmData {
  advanceAmount: number;
  paymentDate: string;
}

export interface PendingInfo {
  advanceAmount: number;
  dueDate: string;
}
