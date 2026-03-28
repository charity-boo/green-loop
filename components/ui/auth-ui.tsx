"use client";

import React from 'react';

// Utility for merging classes
export const cn = (...classes: (string | boolean | null | undefined)[]) => classes.filter(Boolean).join(' ');

// Card Components
interface CardProps { children: React.ReactNode, className?: string }
export const Card: React.FC<CardProps> = ({ children, className }) => <div className={cn("bg-card text-card-foreground rounded-xl shadow-lg border border-transparent dark:border-border transition-colors", className)}>{children}</div>;
export const CardHeader: React.FC<CardProps> = ({ children }) => <div className="p-6 pb-2 transition-colors">{children}</div>;
export const CardTitle: React.FC<CardProps> = ({ children }) => <h2 className="text-xl font-bold text-foreground transition-colors">{children}</h2>;
export const CardDescription: React.FC<CardProps> = ({ children }) => <p className="text-sm text-muted-foreground transition-colors">{children}</p>;
export const CardContent: React.FC<CardProps> = ({ children }) => <div className="p-6 pt-0 transition-colors">{children}</div>;

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { children: React.ReactNode, className?: string, disabled?: boolean, onClick?: () => void, type?: "button" | "submit" }
export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
    <button className={cn("px-4 py-2 rounded-md font-semibold transition-all shadow-sm", className || 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600')} {...props}>{children}</button>
);

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { id: string }
export const Input: React.FC<InputProps> = (props) => (
    <input className="w-full border border-input bg-background text-foreground rounded-md p-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" {...props} />
);

// Label Component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { htmlFor: string }
export const Label: React.FC<LabelProps> = ({ children, ...props }) => (
    <label className="block text-sm font-medium text-foreground mb-1 transition-colors" {...props}>{children}</label>
);
