import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2 } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function DocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    console.log('Starting file upload:', acceptedFiles[0].name);

    try {
      const file = acceptedFiles[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      console.log('File uploaded successfully:', data);
      toast({
        title: "File uploaded successfully",
        description: "Your document is being processed...",
      });

      // Here we would call the OpenAI API to process the document
      setIsProcessing(true);
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);

      toast({
        title: "Document processed",
        description: "AI analysis complete",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  return (
    <Card className="bg-gray-800/40 border-gray-700 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle className="text-gray-100">Document Upload</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Upload documents for AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-primary/50'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-primary">Drop the file here</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-300">Drag & drop a file here, or click to select</p>
              <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX, and TXT files</p>
            </div>
          )}
        </div>

        {(isUploading || isProcessing) && (
          <div className="mt-4 flex items-center justify-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{isUploading ? 'Uploading...' : 'Processing with AI...'}</span>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            disabled={isUploading || isProcessing}
            onClick={() => document.querySelector('input')?.click()}
          >
            Select File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}