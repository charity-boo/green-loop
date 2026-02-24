"use client";

import React from 'react';

// Utility for merging classes
export const cn = (...classes: (string | boolean | null | undefined)[]) => classes.filter(Boolean).join(' ');

// Card Components
interface CardProps { children: React.ReactNode, className?: string }
export const Card: React.FC<CardProps> = ({ children, className }) => <div className={cn("bg-white rounded-xl shadow-lg", className)}>{children}</div>;
export const CardHeader: React.FC<CardProps> = ({ children }) => <div className="p-6 pb-2">{children}</div>;
export const CardTitle: React.FC<CardProps> = ({ children }) => <h2 className="text-xl font-bold">{children}</h2>;
export const CardDescription: React.FC<CardProps> = ({ children }) => <p className="text-sm text-gray-500">{children}</p>;
export const CardContent: React.FC<CardProps> = ({ children }) => <div className="p-6 pt-0">{children}</div>;

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { children: React.ReactNode, className?: string, disabled?: boolean, onClick?: () => void, type?: "button" | "submit" }
export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
    <button className={cn("px-4 py-2 rounded-md font-semibold transition", className || 'bg-green-600 text-white hover:bg-green-700')} {...props}>{children}</button>
);

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { id: string }
export const Input: React.FC<InputProps> = (props) => (
    <input className="w-full border border-gray-300 rounded-md p-2" {...props} />
);

// Label Component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { htmlFor: string }
export const Label: React.FC<LabelProps> = ({ children, ...props }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1" {...props}>{children}</label>
);
