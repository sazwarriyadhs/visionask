import Image from 'next/image';
import { VisionAskClient } from '@/components/vision-ask-client';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <header className="text-center my-8 md:my-12 flex flex-col items-center">
          <Image src="/images/Logo.png" alt="VisionAsk Logo" width={400} height={100} data-ai-hint="logo" />
          <p className="text-primary mt-4 text-lg">
            Upload a PDF, JPG, or PNG, and ask any question about its content
          </p>
        </header>
        <VisionAskClient />
      </div>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        develop by Azwar Riyadh @2024
      </footer>
    </div>
  );
}
