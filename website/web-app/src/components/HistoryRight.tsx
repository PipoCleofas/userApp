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

    // Divide messages into three groups for each column
    const groupedMessages = [[], [], []];
    messages.forEach((message, index) => {
        groupedMessages[index % 3].push(message);
    });

    return (
        <div style={{ 
            minHeight: '100vh', 
            width: '100vw',
            padding: '40px', 
            backgroundColor: '#f5d2d1', 
            display: 'flex', 
            justifyContent: 'center',
            gap: '20px',
            boxSizing: 'border-box'
        }}>
            {groupedMessages.map((group, colIndex) => (
                <div key={colIndex} style={{
                    backgroundColor: '#f5d2d1',
                    padding: '20px',
                    borderRadius: '10px',
                    flex: '1',
                    maxWidth: '300px',
                    minHeight: '400px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px' // Space between messages
                }}>
                    {group.length > 0 ? (
                        group.map((message) => (
                            <div
                                key={message.id} 
                                style={{
                                    backgroundColor: '#e0e0e0',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                    flex: '1' // Makes each message take up available width
                                }}
                            >
                                <p style={{ fontSize: '14px', margin: 0 }}>Message: {message.message}</p>
                            </div>
                        ))
                    ) : (
                        <p>No messages available.</p>
                    )}
                </div>
            ))}
        </div>
    );
}
