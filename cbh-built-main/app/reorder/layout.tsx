"use client";

import { OrderProvider } from "../order/context/OrderContext";

export default function ReorderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrderProvider>{children}</OrderProvider>;
}

