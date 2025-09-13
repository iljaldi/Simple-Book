import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Camera, FileImage, AlertTriangle, CheckCircle, X, RotateCcw, Square, XCircle } from 'lucide-react';
import { useReceipts } from '@/hooks/useReceipts';
import { cn } from '@/lib/utils';

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export const ReceiptUpload: React.FC = () => {
  const { uploadReceipt, isUploading } = useReceipts();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newUploadingFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Process files one by one
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadingFiles(prev => 
            prev.map(uf => 
              uf.file === file && uf.progress < 90 
                ? { ...uf, progress: uf.progress + 10 }
                : uf
            )
          );
        }, 200);

        await new Promise(resolve => {
          uploadReceipt(file, {
            onSuccess: () => {
              clearInterval(progressInterval);
              setUploadingFiles(prev => 
                prev.map(uf => 
                  uf.file === file 
                    ? { ...uf, progress: 100, status: 'success' }
                    : uf
                )
              );
              resolve(true);
            },
            onError: (error: any) => {
              clearInterval(progressInterval);
              setUploadingFiles(prev => 
                prev.map(uf => 
                  uf.file === file 
                    ? { ...uf, status: 'error', error: error.message }
                    : uf
                )
              );
              resolve(false);
            }
          });
        });
      } catch (error) {
        setUploadingFiles(prev => 
          prev.map(uf => 
            uf.file === file 
              ? { ...uf, status: 'error', error: '업로드 중 오류가 발생했습니다.' }
              : uf
          )
        );
      }
    }

    // Clean up successful uploads after 3 seconds
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(uf => uf.status !== 'success'));
    }, 3000);
  }, [uploadReceipt]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeUploadingFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(uf => uf.file !== file));
  };

  const retryUpload = (file: File) => {
    setUploadingFiles(prev => 
      prev.map(uf => 
        uf.file === file 
          ? { ...uf, status: 'uploading', progress: 0, error: undefined }
          : uf
      )
    );
    onDrop([file]);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 후면 카메라 우선
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('카메라 접근 오류:', error);
      alert('카메라에 접근할 수 없습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const savePhoto = async () => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `receipt_${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          
          await onDrop([file]);
          stopCamera();
        }
      }, 'image/jpeg', 0.8);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (isCameraOpen) {
    return (
      <div className="space-y-6">
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Camera className="h-5 w-5" />
              영수증 촬영
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!capturedImage ? (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-white border-dashed m-4 rounded-lg pointer-events-none">
                    <div className="absolute top-2 left-2 right-2 text-center">
                      <p className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                        영수증이 테두리 안에 전체가 보이도록 촬영하세요
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={capturePhoto} className="flex-1">
                    <Square className="h-4 w-4 mr-2" />
                    촬영하기
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="촬영된 영수증"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={savePhoto} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    저장하기
                  </Button>
                  <Button onClick={retakePhoto} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    다시 촬영
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    <XCircle className="h-4 w-4 mr-2" />
                    취소
                  </Button>
                </div>
              </div>
            )}
            
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            영수증 업로드
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-0 text-center cursor-pointer transition-smooth h-48 flex flex-col items-center justify-center",
              isDragActive && !isDragReject && "border-primary bg-primary/5",
              isDragReject && "border-destructive bg-destructive/5",
              !isDragActive && "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <input {...getInputProps()} />
            <Upload className={cn(
              "h-12 w-12 mx-auto mb-4 transition-smooth",
              isDragActive ? "text-primary" : "text-muted-foreground"
            )} />
            
            {isDragReject ? (
              <div className="text-destructive">
                <p className="mb-2">지원하지 않는 파일 형식입니다</p>
                <p className="text-sm">JPG, PNG, PDF 파일만 업로드 가능합니다</p>
              </div>
            ) : isDragActive ? (
              <div className="text-primary">
                <p className="mb-2">파일을 여기에 놓으세요</p>
                <p className="text-sm">업로드가 시작됩니다</p>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <p className="mb-2">영수증을 여기로 드래그하거나 클릭하여 업로드하세요</p>
                <p className="text-sm">JPG, PNG, PDF 파일을 지원합니다 (최대 10MB)</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4 p-4">
            <Button 
              {...getRootProps()} 
              variant="outline" 
              className="transition-smooth flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              파일 선택
            </Button>
            <Button 
              onClick={startCamera}
              className="transition-smooth flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              사진 촬영
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">업로드 진행 상황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadingFiles.map((uploadingFile, index) => (
              <div key={`${uploadingFile.file.name}-${index}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {uploadingFile.status === 'success' && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    {uploadingFile.status === 'error' && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    {uploadingFile.status === 'uploading' && (
                      <Upload className="h-4 w-4 text-primary animate-pulse" />
                    )}
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {uploadingFile.file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {uploadingFile.status === 'error' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryUpload(uploadingFile.file)}
                      >
                        재시도
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeUploadingFile(uploadingFile.file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {uploadingFile.status === 'uploading' && (
                  <Progress value={uploadingFile.progress} className="h-2" />
                )}
                
                {uploadingFile.error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {uploadingFile.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upload Tips */}
      <Alert className="border-primary/20 bg-primary/5">
        <FileImage className="h-4 w-4" />
        <AlertDescription className="text-sm text-muted-foreground">
          <strong>촬영 팁:</strong> 영수증이 화면에 전체가 보이도록 촬영하고, 
          그림자나 반사를 피해 주세요. OCR 인식 정확도가 향상됩니다.
        </AlertDescription>
      </Alert>
    </div>
  );
};