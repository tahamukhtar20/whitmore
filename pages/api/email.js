import {Resend} from 'resend';
import {ContactFormTemplate} from "../../components/ContactFormTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    const {name, email, message} = req.body;
    const {data, error} = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: ['hello@whitmore.example'],
        subject: 'New Contact Form Submission',
        reply_to: email,
        react: ContactFormTemplate({name, email, message}),
    });

    if (error) {
        return res.status(400).json(error);
    }

    res.status(200).json(data);
};
