import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import CommitmentForm from './commitmentForm';
export default function CommitmentMenu(){

    const { state, dispatch } = useUser();
    const [commitments, setCommitments] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const colorPalette = [
        '#B0E0E6', // Pale blue
        '#D5E8D4', // Light green
        '#F8E6D2', // Soft peach
        '#D3D3E7', // Lavender
        '#FAE3E3', // Light blush
        '#F2D7EE', // Pale pink
        '#C2D9E7', // Light sky blue
        '#F8EDD3', // Cream
        '#D4E2D4', // Mint
        '#E7D3C2'  // Beige
    ];
    const commitmentStyle = {
        position: 'relative',
        marginBottom: '15px',
        padding: '15px',
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      };
      
      const removeButtonStyle = {
        position: 'absolute',
        top: '5px',
        right: '5px',
        background: 'transparent',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        color: 'red', // Optional: make it visible
      };
         

    useEffect(() => { 
           
          if (state.commitments && state.commitments.length > 0) {
            setCommitments(state.commitments);
            return;
          }     
   
      }, [state.id, dispatch, state.commitments]);
    
      

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12; // Converts "0" to "12" for midnight
    
        return `${formattedHour}:${minutes} ${period}`;
    };
    
    const handleRemoveCommitment = async (commitmentId) =>{
        
        try {
            const response = await fetch(`http://localhost:5000/api/removeCommitment/${state.id}/${commitmentId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Successfully deleted from the backend, now update the context
                const updatedCommitments = state.commitments.filter(commitment => commitment.id !== commitmentId);
                
                // Dispatch the updated commitments to the context
                dispatch({ type: 'SET_COMMITMENTS', payload: updatedCommitments });
          
                console.log("Commitment removed. Updated commitments: ", updatedCommitments);
              } else {
                console.error("Failed to delete commitment");
              }
            } catch (error) {
              console.error("Error deleting commitment:", error);
            }
         

    };

    
    const renderCommitments = () => {
        
        if (commitments.length > 0) {
            return (
                <div>
                    {commitments.map((commitment, index) => {
                        // Parse days if it is a JSON string or comma-separated string
                        const parsedDays = Array.isArray(commitment.days)
                            ? commitment.days
                            : JSON.parse(commitment.days) || commitment.days.split(',');
        
                        // Parse dates if it's a JSON string
                        const parsedDates = Array.isArray(commitment.dates)
                            ? commitment.dates
                            : JSON.parse(commitment.dates);
                        const lastDigit = commitment.id % 10;
                        const color = colorPalette[lastDigit];
                        return (
                            <div key={index} style={{...commitmentStyle,backgroundColor:color}}>
                                <button style={removeButtonStyle}
                                    onClick={() => handleRemoveCommitment(commitment.id)}
                                   
                                >
                                    &times;
                                </button>
                                <h3>{commitment.name || 'N/A'}</h3>
                                <p>{formatTime(commitment.startTime)} - {formatTime(commitment.endTime)}</p>
                                <p>{parsedDays.length > 0 ? `${parsedDays.join(', ')}` : ''}</p>
                                <p>
                                    {parsedDates.length > 0 
                                        ? `${new Date(parsedDates[0]).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` 
                                        : ''}
                                    {parsedDates.length > 1 
                                        ? ` - ${new Date(parsedDates[1]).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` 
                                        : ''}
                                </p>
                            </div>
                        );
                    })}
                </div>
            );
        }
        
    };

  

    return(


        <div>

            {!commitments.length > 0 ? 'Empty' : renderCommitments()}

            {!showForm && (
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    Add Commitment
                </button>
            )}
            {showForm && (
                <CommitmentForm />
            )}

        </div>


    )


}