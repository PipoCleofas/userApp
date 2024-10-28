import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";

export default function ServiceRequestList() {
  const [requests, setRequests] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleRequests() {
      try {
        const response = await axios.get('http://192.168.100.28:3000/servicerequest/getRequests');
        console.log(response.data);
        setRequests(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch requests');
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
            <p>User ID: {values.userid}</p>
            <p>Request Type: {values.requesttype}</p>
            <p>Status: {values.status.toLowerCase() === 'pending' ? (
              <span style={{ color: 'orange' }}>{values.status}</span>
            ) : values.status}</p>
            <p>Address: {values.address}</p>
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