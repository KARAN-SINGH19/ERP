import React from 'react'
import Alert from 'react-bootstrap/Alert'

const ShowAlert = ({ variant, message }) => {
    return (
        <div>
            <Alert variant={variant}>
                {message}
            </Alert>
        </div>
    )
}

export default ShowAlert


