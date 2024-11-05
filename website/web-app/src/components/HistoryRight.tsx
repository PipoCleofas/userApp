import { useEffect, useState } from 'react';
import { useGetItems } from '../hooks/useGetItems';
import axios from 'axios';

export default function MessagesRight() {
    const { checkAccounts, messages } = useGetItems();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await checkAccounts('messages');
            setLoading(false);
        };

        fetchData();
    }, [checkAccounts]);

    if (loading) {
        return <div>Loading...</div>;
    }

    async function updateMessageStatus(id: number) {
        try {
            await axios.put(`http://192.168.100.127:3000/messaging/updateMessage`, {
                id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(`Message with ID ${id} updated successfully`);
        } catch (err) {
            console.error('Error updating message status:', err);
        }
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
            {messages && messages.length > 0 ? (
                messages.slice(0, 6).map((message) => (
                    <div
                        key={message.id} 
                        style={{
                            backgroundColor: '#e0e0e0',
                            padding: '20px',
                            marginBottom: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            maxWidth: '500px',
                        }}
                    >
                        <p style={{ marginBottom: '10px', fontSize: '18px' }}>Message: {message.message}</p>
                        <button
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                borderRadius: '5px',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: '#5cb85c',
                                color: '#fff',
                                transition: 'background-color 0.3s',
                            }}
                            onClick={() => updateMessageStatus(message.id)}
                        >
                            Got it!
                        </button>
                    </div>
                ))
            ) : (
                <p>No messages available.</p>
            )}
        </div>
    );
}

