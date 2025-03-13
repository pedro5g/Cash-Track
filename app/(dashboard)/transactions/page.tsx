import { Transaction } from "@/components/__transactions/transaction";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Transactions",
};

export default async function Transactions() {
  return <Transaction />;
}
