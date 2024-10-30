"use client";
import Link from "next/link";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const WalletComp = ({ data, data2, wallets }) => {
  const [openinves, setopeninvest] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponseData] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const { user } = useAuthContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const deleteWallet = async (walletId) => {
    try {
      const response = await axios.delete(`/api/wallet/${walletId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.status === 200) {
        toast.success("Wallet deleted successfully!");
        setShowDeleteModal(false); // Close modal after deletion
        // Remove wallet from local state if needed
      } else {
        toast.error(response.data.error || "Failed to delete wallet");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleDeleteClick = (wallet) => {
    setSelectedWallet(wallet);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedWallet) {
      deleteWallet(selectedWallet._id);
    }
  };

  return (
    <>
      <section
        className="items-center justify-center min-h-screen w-full bg-[#1c222c] p-4 dash"
        style={{
          maxWidth: "calc(100vw - 260px)",
          padding: "70px 20px",
          boxSizing: "border-box",
          color: "#fff",
          overflowX: "hidden",
        }}
      >
        {/* Header Section */}
        <div className="header-section">
          <h2>Wallets</h2>
        </div>

        {/* Wallet List Section */}
        <div className="wallet-list-section">
          {wallets.map((wallet) => (
            <div key={wallet._id} className="wallet-item">
              <Link
                href={`/admin/wallets/edit/${wallet._id}`}
                className="wallet-link"
              >
                {wallet.name}
              </Link>
              <button
                onClick={() => handleDeleteClick(wallet)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>
                Are you sure you want to delete {selectedWallet?.name} wallet?
              </p>
              <div className="modal-buttons">
                <button onClick={confirmDelete} className="confirm-button">
                  OK
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </section>

      <style jsx>{`
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .wallet-list-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }
        .wallet-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #374151;
          padding: 20px;
          border-radius: 8px;
        }
        .wallet-link {
          color: #cbd5e1;
          text-decoration: none;
        }
        .delete-button {
          background-color: red;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          padding: 5px 10px;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background-color: #1f2937;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          text-align: center;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }
        .confirm-button {
          background-color: green;
          color: white;
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
        }
        .cancel-button {
          background-color: grey;
          color: white;
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default WalletComp;
