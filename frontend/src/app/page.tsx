"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col  items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Input Textarea (Expandable) */}
      <Textarea
        className={`w-[50vw] !text-xl transition-all duration-500 ${
          submitted ? "h-[5vh] text-base cursor-pointer" : "h-[40vh] text-xl"
        }`}
        placeholder="Type your message here."
        onClick={() => setSubmitted(false)} // Expand on click when minimized
      />

      {/* Submit Button - Disappears after submission */}
      {!submitted && (
        <Button
          className="mt-4 w-[10vw] p-4 cursor-pointer transition-opacity duration-300"
          onClick={() => setSubmitted(true)}
        >
          Submit
        </Button>
      )}
      
      {/* Two Shapes Below the Minimized Textarea - Appear on Submit */}
      {submitted && (
        
        <div className="flex flex-row gap-4 mt-4 transition-opacity pt-15 duration-500">
          {/* First Gray Card */}
          <Card className="w-[40vw] h-[60vh] bg-gray-200">
            <CardContent className="flex items-center justify-center h-full">
              Output Box 1
            </CardContent>
          </Card>

          {/* Second Gray Card */}
          <Card className="w-[30vw] h-[60vh] bg-gray-300">
            <CardContent className="flex items-center justify-center h-full">
              Output Box 2
            </CardContent>
          </Card>
          
        </div>
      )}
    </div>
   
  );
}
