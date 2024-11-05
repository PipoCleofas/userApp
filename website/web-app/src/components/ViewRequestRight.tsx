import { useEffect, useState } from 'react';
import { useGetItems } from '../hooks/useGetItems';
import { updateStatusRequest } from '../services/servicerequest';
import { updateMarkerRequest } from '../services/marker'; 
import axios from 'axios';
import { useLanguageContext } from '../context/LanguageProvider';

export default function ViewRequestRight() {
    const { checkAccounts, requests } = useGetItems();
    const [loading, setLoading] = useState(true);
    const { translations, language } = useLanguageContext();
    const t = translations[language]; // Get translations for current language

    useEffect(() => {
        const fetchData = async () => {
            await checkAccounts('requests');
            setLoading(false);
        };

        fetchData();
    }, [checkAccounts]);

    const handleStatusUpdate = async (status: string, userId: number) => {
        try {
            await updateStatusRequest(status, userId);
    
            const requestIds = requests.map(request => request.UserID);
    
            for (let id of requestIds) {
                /*const markerTitleResponse = await axios.put(`http://192.168.100.127:3000/marker/updateMarkerTitle/${id}`, {
                    newTitle: 'Cancelled Service'  
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });*/

                if(status === 'approved'){
                    const markerDescResponse = await axios.put(`http://192.168.100.127:3000/marker/updateMarkerDesc/${id}`, {
                        newDesc: 'approved'  
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
                
    
            }
    
            // Log after the for loop
            console.log(`Request status updated to ${status} for UserID: ${userId}`);
        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            width: '100vw',
            padding: '40px', 
            backgroundColor: '#f5d2d1', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            margin: 0, 
            boxSizing: 'border-box' 
        }}>
            {requests
                .filter((request: any) => request.RequestStatus === 'pending') // Filter for pending requests
                .slice(0, 3) // Limit to 3 requests
                .map((request: any, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: '#e0e0e0',
                            padding: '20px',
                            marginBottom: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            maxWidth: '500px'  
                        }}
                    >
                        <p style={{ marginBottom: '10px', fontSize: '18px' }}>User ID: {request.UserID}</p>
                        <p style={{ marginBottom: '10px', fontSize: '18px' }}>Request Type: {request.RequestType}</p>
                        <p style={{ marginBottom: '10px', fontSize: '18px' }}>Status: {request.RequestStatus}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: '#5cb85c',
                                    color: '#fff',
                                    transition: 'background-color 0.3s'
                                }}
                                onClick={() => handleStatusUpdate('approved', request.UserID)}
                            >
                                {t.approve}
                            </button>
                            <button
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: '#d9534f',
                                    color: '#fff',
                                    transition: 'background-color 0.3s'
                                }}
                                onClick={() => handleStatusUpdate('rejected', request.UserID)}
                            >
                                {t.reject}
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    );
    
}