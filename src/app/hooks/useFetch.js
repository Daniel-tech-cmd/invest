import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import Cookies from "js-cookie";
const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const { user, dispatch } = useAuthContext();
  const router = useRouter();
  const fetchDataAll = async (url) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Add the token to the 'Authorization' header
        },
      });
      const data = await res.json();
      if (res.ok) {
        setResponseData(data);
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };
  async function deleteData(postId) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/api/user/delete/${postId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status !== 200) {
        setIsLoading(false);
        setError(response.data.error);
      }

      if (response.status === 200) {
        setResponseData(response.data);
        setIsLoading(false);
        alert("deleted");
      }
    } catch (error) {
      if (error?.message) {
        if (
          error.message ===
          "getaddrinfo ENOTFOUND ac-dqmw5os-shard-00-01.n3fknvn.mongodb.net"
        ) {
          setError("Network error");
        } else {
          setError(error.message);
        }
      }
      if (error?.response?.data.error) {
        if (
          error.response?.data.error ===
          "getaddrinfo ENOTFOUND ac-dqmw5os-shard-00-01.n3fknvn.mongodb.net"
        ) {
          setError("Network error");
        } else {
          setError(error.response.data.error);
        }
      }
    }
  }
  async function invest(data) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post(`/api/deposit/${user?._id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status !== 200) {
        setIsLoading(false);
        setError(response.data.error);
      }

      // if (!response.ok) {
      // 	setError('Failed to update post ');
      // 	setIsLoading(false);
      // }
      if (response.status === 200) {
        setResponseData(response.data);
        setIsLoading(false);
        toast.success("Deposit Request,succesful!");
      }

      // Handle successful response here, e.g., show a success message
    } catch (error) {
      setIsLoading(false);
      if (error?.message) {
        if (error.message.includes("ENOTFOUND")) {
          setError("Network error");
        } else {
          setError(error.message);
        }
      }
      if (error?.response?.data.error) {
        if (error.response?.data.error.includes("ENOTFOUND")) {
          setError("Network error");
        } else {
          setError(error.response.data.error);
          toast.error(error.response.data.error);
        }
      }
    }
  }
  async function depositfun(data) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/transact/deposit/${user?._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        setError("deposit error ");
        setIsLoading(false);
        toast.error("Network error");
      }
      if (response.ok) {
        toast.success("Deposit request, successful.");

        setResponseData(response);
        setIsLoading(false);
        // toast.dismiss();
      }

      // Handle successful response here, e.g., show a success message
    } catch (error) {
      // Handle error here, e.g., display an error message or log the error
      console.error(error.message);
      setError(error.message);
      setIsLoading(false);
    }
  }
  async function withdraw(data) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_URL}/api/transact/withdraw/${user?._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status !== 200) {
        setIsLoading(false);
        setError(response.data.error);
        toast.error(response.data.error);
      }

      if (response.status === 200) {
        setResponseData(response.data);
        setIsLoading(false);
        toast.success("Withdraw Request, successful.");
      }
    } catch (error) {
      if (error?.message) {
        if (error.message.includes("ENOTFOUND")) {
          setError("Network error");
          toast.error("Network error");
        } else {
          setError(error.message);
          setIsLoading(false);
        }
      }
      if (error?.response?.data.error) {
        if (error.response?.data.error.includes("ENOTFOUND")) {
          setError("Network error");
          toast.error("Network error");
        } else {
          setError(error.response.data.error);
          setIsLoading(false);
          toast.error(error.response.data.error);
        }
      }
    }
  }
  async function transfer(data) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/user/transfer/${user?._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        try {
          console.log("error");
          // Try to parse the response body as JSON
          const errorData = await response.json();

          // If successful, extract and display the error message
          if (errorData && errorData.message) {
            setError(`Transfer error: ${errorData.message}`);
          } else {
            // If the response body is not valid JSON or doesn't contain a message, use a generic error message
            setError("Transfer error: Something went wrong");
          }
        } catch (error) {
          // If there's an error parsing the JSON, use a generic error message
          setError("Transfer error: Something went wrong");
        }
      }
      if (response.ok) {
        setResponseData(response);
        setIsLoading(false);
      }

      // Handle successful response here, e.g., show a success message
    } catch (error) {
      // Handle error here, e.g., display an error message or log the error
      console.error(error.message);
      setError(error.message);
    }
  }

  async function updatePost(postId, data) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_URL}/api/user/updateuser/${postId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status !== 200) {
        setIsLoading(false);
        setError(response.data.error);
      }

      if (response.status === 200) {
        setResponseData(response.data);
        setIsLoading(false);
        toast.success("Updated");
      }

      // Handle successful response here, e.g., show a success message
    } catch (error) {
      if (error?.message) {
        if (error.message.includes("ENOTFOUND")) {
          setError("Network error");
          toast.error("Network error");
        } else {
          setError(error.message);
          toast.error(error.message);
          setIsLoading(false);
        }
      }
      if (error?.response?.data.error) {
        if (error.response?.data.error.includes("ENOTFOUND")) {
          setError("Network error");
          toast.error("Network error");
        } else {
          setError(error.response.data.error);
          setIsLoading(false);
          toast.error(error.response.data.error);
        }
      }
    }
  }

  async function reinvest(data) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_URL}/api/transact/reinvest/${user?._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status !== 200) {
        setIsLoading(false);
        setError(response.data.error);
      }

      if (response.status === 200) {
        setResponseData(response.data);
        setIsLoading(false);
        toast.success("Re-investment Request,succesful!");
      }
    } catch (error) {
      setIsLoading(false);
      if (error?.message) {
        if (error.message.includes("ENOTFOUND")) {
          setError("Network error");
        } else {
          setError(error.message);
        }
      }
      if (error?.response?.data.error) {
        if (error.response?.data.error.includes("ENOTFOUND")) {
          setError("Network error");
        } else {
          setError(error.response.data.error);
          toast.error(error.response.data.error);
        }
      }
    }
  }
  async function forgot(data) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/user/forgot/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status !== 200) {
        setIsLoading(false);
        setError(response.data.error);
      }

      if (response.status === 200) {
        setResponseData(response.data);
        setIsLoading(false);
        toast.success("Password reset Link has been sent to your email!");
      }
    } catch (error) {
      if (error?.message) {
        if (error.message.includes("ENOTFOUND")) {
          setError("Network error");
          toast.error("Network error");
        } else {
          setError(error.message);
          // toast.error(error.message);
          setIsLoading(false);
        }
      }
      if (error?.response?.data.error) {
        if (error.response?.data.error.includes("ENOTFOUND")) {
          setError("Network error");
          toast.error("Network error");
        } else {
          setError(error.response.data.error);
          setIsLoading(false);
          toast.error(error.response.data.error);
        }
      }
    }
  }
  async function change(data) {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/user/change/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status !== 200) {
        setIsLoading(false);
        setError(response.data.error);
      }

      if (response.status === 200) {
        setResponseData(response.data);
        setIsLoading(false);
        toast.success("Password chnged!");
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch({
          type: "LOGIN",
          payload: response.data,
        });
        Cookies.set("user", JSON.stringify(response.data));
        setIsLoading(false);
        toast.success("Login successful!");
        router.push(`/account/dashboard/${response?.data._id}`);
      }
    } catch (error) {
      if (error?.message) {
        if (error.message.includes("ENOTFOUND")) {
          setError("Network error");
          toast.error("Network error");
        } else {
          setError(error.message);
          // toast.error(error.message);
          setIsLoading(false);
        }
      }
      if (error?.response?.data.error) {
        if (error.response?.data.error.includes("ENOTFOUND")) {
          setError("Network error");
          toast.error("Network error");
        } else {
          setError(error.response.data.error);
          setIsLoading(false);
          toast.error(error.response.data.error);
        }
      }
    }
  }

  return {
    responseData,
    error,
    withdraw,
    fetchDataAll,
    deleteData,
    change,
    forgot,
    isLoading,
    updatePost,
    reinvest,
    depositfun,
    invest,
    transfer,
  };
};
export default useFetch;
