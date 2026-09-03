import WalletForm from "../components/WalletForm";

export const metadata = { title: "Add Wallet — GoldGroveco" };

export default function AddWalletPage() {
  return (
    <section aria-label="Add wallet">
      <WalletForm mode="add" />
    </section>
  );
}
