// components
import Circles from '/components/Circles';

// icons
import {BsArrowRight} from 'react-icons/bs';

// framer
import {motion} from 'framer-motion';

// variants
import {fadeIn} from '../../variants';
import {useState} from "react";
import {useRouter} from "next/router";

// toast
import { toast } from 'sonner';

const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    })
    const router = useRouter();
    const headers = {
        'Content-Type': 'application/json'
    }
    
    const init = {
        method: 'POST',
        body: JSON.stringify(form),
        headers: headers
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const toastId = toast.promise(fetch('/api/email', init), {
            loading: 'Loading...',
            success: () => {
                setForm({
                    name: '',
                    email: '',
                    message: ''
                })
                setTimeout(() => {
                    router.push('/').then()
                    toast.dismiss(toastId);
                }, 1000);
                return `Email sent!`
            },
            error: 'Error sending email!',
        });
        }

    return (
        <div className='h-full bg-primary/30'>
            <div className='container mx-auto py-32 text-center xl:text-left flex items-center justify-center h-full'>
                {/* text & form */}
                <div className='flex flex-col w-full max-w-[700px]'>
                    {/* text */}
                    <motion.h2
                        variants={fadeIn('up', 0.2)}
                        initial='hidden'
                        animate='show'
                        exit='hidden'
                        className='h2 text-center mb-12'
                    >
                        Let&apos;s <span className='text-accent'>connect.</span>
                    </motion.h2>
                    {/* form */}
                    <motion.form
                        variants={fadeIn('up', 0.4)}
                        initial='hidden'
                        animate='show'
                        exit='hidden'
                        onSubmit={handleFormSubmit}
                        className='flex-1 flex flex-col gap-6 w-full mx-auto'
                    >
                        {/* input group */}
                        <div className='flex gap-x-6 w-full'>
                            <input type='text' placeholder='name' required className='input'
                                   onChange={(e) => setForm({...form, name: e.target.value})}/>
                        </div>
                        <div className='flex gap-x-6 w-full'>
                            <input type='text' placeholder='email' required className='input lowercase'
                                   onChange={(e) => setForm({...form, email: e.target.value})}/>
                        </div>
                        <textarea placeholder='message' required className='textarea lowercase'
                                  onChange={(e) => setForm({...form, message: e.target.value})}></textarea>
                        <button
                            className='btn rounded-full border border-white/50 max-w-[170px] px-8 transition-all duration-300 flex items-center justify-center overflow-hidden hover:border-accent group'>
                            <span
                                className='group-hover:-translate-y-[120%] group-hover:opacity-0 transition-all duration-500'>
                                Let&apos;s talk
                            </span>
                            <BsArrowRight
                                className='-translate-y-[120%] opacity-0 group-hover:flex group-hover:-translate-y-0 group-hover:opacity-100 transition-all duration-300 absolute text-[22px]'/>
                        </button>
                    </motion.form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
