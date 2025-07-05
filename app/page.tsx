"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      {/* Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-2">
          <Image src="/assets/OneTeamlogoFinal.jpeg" alt="oneTeam Logo" width={40} height={40} />
          <h1 className="text-xl font-bold text-[#0A66C2]">oneTeam</h1>
        </div>
        <Link href="/signin">
          <Button className="rounded-xl px-5 py-2 shadow-md text-base bg-[#34A853] text-white hover:bg-green-600">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-[#0A66C2]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Build, Collaborate, Win — with <span className="text-[#34A853]">oneTeam</span>
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          The ultimate hackathon starter kit with modern tech, seamless UX, and scalable infrastructure.
        </motion.p>
      </section>

      {/* Features Grid */}
      <section className="mt-20 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-[#F4F6F8] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-[#F4F6F8] border-none">
              <CardContent className="space-y-4">
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#0A66C2]">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
    </main>
  );
}

const features = [
  {
    title: "Responsive Design",
    description: "Works perfectly across desktops, tablets, and phones.",
    icon: "📱",
  },
  {
    title: "Real-time Updates",
    description: "Live sync using Firebase Firestore.",
    icon: "⚡",
  },
  {
    title: "Modern UI/UX",
    description: "Professional interface using ShadCN and Framer Motion.",
    icon: "🎨",
  },
  {
    title: "Scalable Architecture",
    description: "Next.js 14 App Router & modular folder structure.",
    icon: "🏗️",
  },
  {
    title: "Security",
    description: "Secured with Firebase Auth and Firestore rules.",
    icon: "🔐",
  },
  {
    title: "Performance",
    description: "Optimized with Next.js best practices and lazy loading.",
    icon: "🚀",
  },
];
