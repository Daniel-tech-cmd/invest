import Link from "next/link";
import { getWalletById } from "../../../../../lib/getWallets";
import WalletForm from "../../../components/WalletForm";

export const metadata = { title: "Edit Wallet — GoldGroveco" };

export default async function EditWalletPage({ params }) {
  const { id } = await params;
  const wallet = await getWalletById(id);

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-16" style={{ borderColor: "var(--line-strong)" }}>
        <p className="text-[13px] font-medium text-ink">Wallet not found</p>
        <p className="text-[11px] text-ink-faint">No wallet matches that id.</p>
        <Link href="/admin/wallets" className="btn btn-primary btn-sm mt-2">
          Back to wallets
        </Link>
      </div>
    );
  }

  return (
    <section aria-label="Edit wallet">
      <WalletForm mode="edit" initial={wallet} />
    </section>
  );
}
