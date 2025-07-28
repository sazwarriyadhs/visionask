import { VisionAskClient } from '@/components/vision-ask-client';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center my-8 md:my-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold" style={{ color: 'hsl(var(--primary))' }}>
            VisionAsk
          </h1>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
            Your intelligent assistant for document analysis. Upload a PDF, JPG, or PNG, and ask any question about its content.
          </p>
        </header>
        <VisionAskClient />
      </div>
    </div>
  );
}
