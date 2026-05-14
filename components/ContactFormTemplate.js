import * as React from 'react';

export const ContactFormTemplate = ({ name, email, phone, message }) => (
    <div>
        <h1 style={{color: 'red'}}>Message from Contact Form</h1>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Message:</strong> {message}</p>
    </div>
);
