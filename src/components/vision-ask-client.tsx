'use client';

import { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  FileText,
  Bot,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromDocument } from '@/ai/flows/extract-text-from-document';
import { answerDocumentQuestion } from '@/ai/flows/answer-document-question';

export function VisionAskClient() {
  const [file, setFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoadingOcr, setIsLoadingOcr] = useState<boolean>(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const previewUrl = useMemo(() => {
    if (file && file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
        setFile(selectedFile);
        setOcrText('');
        setQuestion('');
        setAnswer('');
    }
  };
  
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleExtractText = async () => {
    if (!file) return;

    setIsLoadingOcr(true);
    setAnswer('');
    setQuestion('');
    setOcrText('');

    try {
      const dataUri = await fileToDataUri(file);
      const result = await extractTextFromDocument({ fileDataUri: dataUri });
      setOcrText(result.extractedText);
    } catch (e: unknown) {
      toast({
        variant: 'destructive',
        title: 'Text Extraction Failed',
        description: e instanceof Error ? e.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoadingOcr(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question || !ocrText) return;

    setIsLoadingAnswer(true);
    setAnswer('');

    try {
      const result = await answerDocumentQuestion({ ocrText, question });
      setAnswer(result.answer);
    } catch (e: unknown) {
      toast({
        variant: 'destructive',
        title: 'Failed to Get Answer',
        description: e instanceof Error ? e.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-5 gap-6 xl:gap-8">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <UploadCloud className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">1. Upload Document</CardTitle>
            </div>
            <CardDescription>Select a PDF, JPG, or PNG file to begin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <Button onClick={handleTriggerUpload} className="w-full" variant="outline">
              {file ? 'Change File' : 'Select File'}
            </Button>
            {file && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>File Selected</AlertTitle>
                <AlertDescription className="truncate">{file.name}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleExtractText} disabled={!file || isLoadingOcr} className="w-full">
              {isLoadingOcr ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting Text...
                </>
              ) : (
                'Extract Text'
              )}
            </Button>
          </CardContent>
        </Card>
        
        {ocrText && (
           <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">2. Ask a Question</CardTitle>
                </div>
                <CardDescription>Pose a question based on the extracted text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input
                placeholder="e.g., What is the main topic?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isLoadingAnswer}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                />
                <Button onClick={handleAskQuestion} disabled={!question || isLoadingAnswer} className="w-full">
                {isLoadingAnswer ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                    </>
                ) : (
                    'Ask VisionAsk'
                )}
                </Button>
                {answer && (
                    <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent-foreground" style={{color: 'hsl(var(--accent))'}}/>
                        <h3 className="font-semibold">Answer</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
                    </div>
                )}
            </CardContent>
        </Card>
        )}
      </div>

      <div className="lg:col-span-3">
        <Card className="min-h-full">
          <CardHeader>
            <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">Extracted Text</CardTitle>
            </div>
            <CardDescription>The text from your document will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOcr ? (
              <div className="space-y-3">
                {previewUrl && 
                  <Skeleton className="w-full h-64 rounded-md" />
                }
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : ocrText ? (
              <div className="space-y-4">
                {previewUrl && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <Image src={previewUrl} alt="File preview" layout="fill" objectFit="contain" data-ai-hint="document photo" />
                  </div>
                )}
                <Textarea
                  value={ocrText}
                  readOnly
                  placeholder="OCR results will be shown here..."
                  className="h-96 min-h-[24rem] text-sm bg-secondary/30"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-10 border-2 border-dashed rounded-lg h-96">
                <FileText className="h-12 w-12 mb-4" />
                <p className="font-medium">Your document text is waiting.</p>
                <p className="text-sm">Upload a file and click "Extract Text" to see the magic.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
