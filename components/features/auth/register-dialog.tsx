"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

const RegisterDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* --- Trigger Button (What the user clicks in the Navbar) --- */}
      <DialogTrigger asChild>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white shadow-md transition duration-200"
          onClick={() => setIsOpen(true)}
        >
          Register Now
        </Button>
      </DialogTrigger>

      {/* --- Modal Content --- */}
      <DialogContent className="sm:max-w-[425px] p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-green-800">
            Start Your Green Journey
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Choose an option below to access scheduling, rewards, and reporting tools.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          
          {/* Option 1: Register */}
          <div className="flex items-center space-x-4 p-4 border border-green-200 rounded-lg bg-green-50">
            <UserPlus className="w-6 h-6 text-green-700" />
            <div>
              <p className="font-semibold text-gray-800">New User?</p>
              <p className="text-sm text-gray-600">Create an account in minutes.</p>
            </div>
            <Link href="/auth/register" passHref className="ml-auto">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsOpen(false)}>
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Option 2: Login */}
          <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <LogIn className="w-6 h-6 text-gray-600" />
            <div>
              <p className="font-semibold text-gray-800">Already Registered?</p>
              <p className="text-sm text-gray-600">Welcome back! Sign in here.</p>
            </div>
            <Link href="/auth/login" passHref className="ml-auto">
              <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                Login
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;