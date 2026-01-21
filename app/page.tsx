import { TemplateSelector } from "@/components/TemplateSelector";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 via-slate-50 to-purple-50/50 -z-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <header className="text-center mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Start Your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">Dream Project</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Choose a professional template to jumpstart your development or begin with a blank slate.
            Our AI-powered builder handles the rest.
          </p>
        </header>
        <Link href="/builder/luminous-glow">
          <Button>Nextjs Web Container</Button>
        </Link>
        <TemplateSelector />

      </div>
    </main>
  );
}
