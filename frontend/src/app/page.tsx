"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/CompDropdown";
import markdownToTxt from "markdown-to-txt";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);

  

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  async function generate() {
    setOutputText("Loading...");
    setQuery("");

    try {
      const promptDetails = `Analyze the error ${inputText} and explain in points and in an organized way`;
      const prompt = `Analyze the error:\n${inputText}\n\n1. Identify the programming language.\n2. Identify the relevant topic, be more specific, don't tell what is the error, just tell me if I wanna avoid this error what topic YouTube video should be seen.\n3. It should contain the topic name no explanation or code in one line with spaces no commas or symbols.`;

      const [result, result2] = await Promise.all([
        model.generateContent([prompt]),
        model.generateContent([promptDetails]),
      ]);

      setOutputText(markdownToTxt(result2.response.text()));
      setQuery(result.response.text().trim());
      console.log(result.response.text());
    } catch (error) {
      setOutputText("Error analyzing the error.");
      console.error("Gemini API Error:", error);
    }
  }

  useEffect(() => {
    async function fetchYouTubeVideos() {
      setVideos([])
      if (!query) return;
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=6&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        setVideos(data.items || []);
      } catch (error) {
        console.error("YouTube API Error:", error);
      }
    }

    fetchYouTubeVideos();
  }, [query]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="prose dark:prose-invert">
      <h1 className="mb-10 items-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
     ER<span className="text-red-500">404</span>
    </h1>
  
</div>
      
      <Textarea
        className={`md:w-[50vw] w-[80vw] !text-xl transition-all duration-500 ${
          submitted ? "h-[5vh] text-base cursor-pointer" : "h-[40vh] text-xl"
        }`}
        placeholder="Type your error message here."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}        onClick={() => setSubmitted(false)}
      />

      {!submitted && (
        <Button
          className="mt-4 md:w-[10vw] p-4 cursor-pointer transition-opacity duration-300"
          onClick={() => {
            setSubmitted(true);
            generate();
          }}
        >
          Submit
        </Button>
      )}
{submitted && (
  <div className="flex flex-col md:flex-row gap-4 mt-4 transition-opacity pt-15 duration-500 w-full justify-center items-center">
    {/* Video Results Card */}
    <Card className="md:w-[40%] w-[80%] h-[60vh] bg-gray-200 dark:bg-gray-800 overflow-y-auto">
      <CardContent className=" flex flex-col items-center justify-center pt-20 box-border h-full">
        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id.videoId} className="p-2 border rounded-lg shadow-md bg-white dark:bg-gray-700">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="rounded-lg shadow-md w-full"
                  />
                </a>
              </div>
            ))
          ) : (
            <p className="text-center">Loading...</p>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Output Text Card */}
    <Card className="md:w-[40%] w-[80%] h-[60vh] bg-gray-300 dark:bg-gray-900">
      <CardContent className="flex items-center justify-center h-full">
        <Textarea
          className="h-[54vh] w-full resize-none !text-base bg-white dark:bg-gray-700 dark:text-white"
          value={outputText}
          readOnly
        />
      </CardContent>
    </Card>
  </div>
)}

    </div>
  );
}
