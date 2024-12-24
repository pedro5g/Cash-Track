import { Transaction } from "@/components/__transactions/transaction";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Transactions",
};

export default function Transactions() {
  return <Transaction />;
}
