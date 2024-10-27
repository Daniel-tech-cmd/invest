'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
const useUpdateProfile = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [dpchanged, setdpchanged] = useState(false);
	const [error, setError] = useState(null);
	const [responseData, setResponseData] = useState(null);
	const router = useRouter();

	const { user } = useAuthContext();
	async function updateDp(userid, img) {
		setError(null);
		setIsLoading(true);
		try {
			// console.log(data);
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}/api/user/updatedpf/${userid}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${user?.token}`,
					},
					body: JSON.stringify({ img }),
				}
			);
			// console.log('okay');
			if (!response.ok) {
				setError('Failed to update img ');
				setIsLoading(false);
			}
			if (response.ok) {
				setResponseData(response);
				const data = response.json();
				const dat = await data;
				setdpchanged(true);

				setIsLoading(false);

				// console.log(response.json());
			}

			// Handle successful response here, e.g., show a success message
		} catch (error) {
			// Handle error here, e.g., display an error message or log the error
			console.error('Error updating :', error.message);
			setError(error.message);
		}
	}
	return { updateDp, dpchanged, isLoading };
};

export default useUpdateProfile;
