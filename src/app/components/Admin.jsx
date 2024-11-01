"use client";
import Link from "next/link";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const AdminComp = ({ data, data2 }) => {
  const [openinves, setopeninvest] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponseData] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const { user } = useAuthContext();
  const [patt, setpatt] = useState("");

  const approvedepofn = async (trans, path) => {
    setError(false);
    setIsLoading(true);
    setResponseData(null);

    const data = { ...trans };
    const action =
      trans.type === "deposit"
        ? path === "approve"
          ? "approvedepo"
          : "declinedepo"
        : path === "approve"
        ? "approvedwith"
        : "declinedwith";

    try {
      const response = await axios.patch(`/api/deposit//${user._id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status === 200) {
        setResponseData(response.data);
        setIsLoading(false);
        toast.success(
          `${path === "approve" ? "Approved" : "Declined"} successfully!`
        );
      } else {
        setError(response.data.error);
        setIsLoading(false);
      }
    } catch (error) {
      const errMessage =
        error?.response?.data?.error || error.message || "An error occurred";
      setError(errMessage);
      setIsLoading(false);
      toast.error(errMessage);
    }
  };

  return (
    <>
      <section
        style={{
          padding: "15px",
          backgroundColor: "#1F2937",
          minHeight: "100vh",

          maxWidth: "calc(100vw - 260px)",
          padding: "70px 20px",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
        className="min-h-screen bg-[#1c222c] p-4 md:p-6 w-full dash"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontWeight: 400,
              fontSize: "22px",
              color: "hsl(var(--border) / 0.7)",
            }}
          >
            Users
          </h2>
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setopeninvest(true)}
          >
            {data2.notifications.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  right: "0px",
                  top: "-3px",
                  background: "red",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                }}
              ></span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75 55 119.5 138.5T880-560h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
            </svg>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {data.map((dat) => (
            <Link
              key={dat._id}
              href={`/admin/edit?query=${dat._id}`}
              style={{
                backgroundColor: "#374151",
                padding: "20px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#CBD5E1",
                minWidth: "fit-content",
                textDecoration: "none",
              }}
            >
              <span>{dat.email}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="red"
                style={{ marginLeft: "5px" }}
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
            </Link>
          ))}
        </div>

        {openinves && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#1F2937",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ color: "#FFFFFF" }}>Notifications</h2>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                  onClick={() => setopeninvest(false)}
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </div>

              {data2?.notifications
                ?.slice()
                .reverse()
                .map((dat) => (
                  <div
                    key={dat._id}
                    style={{
                      backgroundColor: "#374151",
                      padding: "15px",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                  >
                    <p style={{ color: "#E5E7EB" }}>{dat.text}</p>
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "hsl(var(--success))",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => approvedepofn(dat, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        style={{
                          backgroundColor: "hsl(var(--danger))",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => approvedepofn(dat, "decline")}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        <ToastContainer />
      </section>
    </>
  );
};

export default AdminComp;
