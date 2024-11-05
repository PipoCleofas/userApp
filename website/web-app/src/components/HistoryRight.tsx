import { useEffect, useState } from 'react';
import { useGetItems } from '../hooks/useGetItems';

export default function MessagesRight() {
    const { checkAccounts, clients, messages } = useGetItems();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const success = await checkAccounts('messages');
            if (success) {
                console.log('Clients fetched successfully:', messages);
            }
            setLoading(false);
        };

        fetchData();
    }, [checkAccounts, clients]);

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
            {messages && messages.length > 0 ? (
                messages.map((message) => (
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
                        <div style={{ display: 'flex', gap: '10px' }} />
                    </div>
                ))
            ) : (
                <p>No messages available.</p>
            )}
        </div>
    );
}
