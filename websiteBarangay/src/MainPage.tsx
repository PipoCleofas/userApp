import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";

function ServiceRequestList() {
  const [requests, setRequests] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleRequests() {
      try {
        const response = await axios.get('http://192.168.1.5:3000/servicerequest/getRequests');
        console.log(response.data);
        setRequests(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError('No service request found');
          console.log(error);
        } else {
          const message = handleAxiosError(error);
          setError(message || 'An error occurred while fetching data.');
        }
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    }
    handleRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }


  return (
      <div style={{ flex: 1, padding: '20px' }}>
        {requests && requests.map((values :any, index :any) => (
          <div key={index} style={requestCardStyle}>
            <p style={{ color: 'orange' }}>User ID: {values.UserID}</p>
            <p style={{ color: 'orange' }}>Username: {values.Username}</p>
            <p style={{ color: 'orange' }}>Request Type: {values.RequestType}</p>
            <p style={{ color: 'orange' }}>Status: {values.RequestStatus === 'pending' ? (
              <span style={{ color: 'orange' }}>{values.RequestStatus}</span>
            ) : values.RequestStatus}</p>
            <p style={{ color: 'orange' }}>Address: {values.Address}</p>
          </div>
        ))}
      </div>
  );
}

//Styles
const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    cursor: 'pointer',
    textAlign: 'left'
  };
  const requestCardStyle = {
    backgroundColor: '#e9ecef',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  };


  export function handleAxiosError(error: any): string {
    if (error.response) {
        console.error('Response error:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        return `Server responded with status ${error.response.status}: ${error.response.data.message || 'An error occurred.'}`;
    } else if (error.request) {
        // The request was made, but no response was received
        console.error('Request error:', error.request);
        return 'No response received from the server. Please check your network connection.';
    } else {
        console.error('General error:', error.message);
        return `Error: ${error.message}`;
    }
}

export default ServiceRequestList;