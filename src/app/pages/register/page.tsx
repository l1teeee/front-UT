'use client';

import { motion } from 'framer-motion';
import Header from '@/app/components/auth/register/HeaderRegister';
import RegisterForm from "@/app/components/auth/register/RegisterForm";
import FooterLinks from "@/app/components/auth/FooterLinks";
import BottomText from "@/app/components/auth/BottomText";

export default function Register() {
    return (
        <motion.div
            className="min-h-screen bg-black flex items-center justify-center px-4 font-mono relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
        >

            <div className="light-effect"></div>

            <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-zinc-900 rounded-full blur-3xl opacity-10 -z-10"
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 15, 0],
                    y: [0, -10, 0]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-zinc-800 rounded-full blur-3xl opacity-10 -z-10"
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, -12, 0],
                    y: [0, 12, 0]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
            />

            <motion.div
                className="w-full max-w-sm relative z-10"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                >
                    <Header />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                >
                    <RegisterForm />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                >
                    <FooterLinks />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
                >
                    <BottomText />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}