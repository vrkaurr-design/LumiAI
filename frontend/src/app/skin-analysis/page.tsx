'use client';
import { useState, useEffect } from 'react';
import { analysisService } from '@/services/analysis.service';
import ProductCard from '@/components/common/ProductCard';
import Spinner from '@/components/common/Spinner';

export default function SkinAnalysisPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analyzeSelfie();
  }, []);

  const analyzeSelfie = async () => {
    setLoading(true);

    try {
      const imageDataUrl = sessionStorage.getItem('selfie');

      if (!imageDataUrl) {
        throw new Error('No selfie found');
      }

      const file = await dataURLtoFile(imageDataUrl, 'selfie.jpg');

      const analysis = await analysisService.analyzeSkin(file);
      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center gap-3">
        <Spinner />
        <span>Analyzing your skin...</span>
      </div>
    );

  if (!result) return <div>No analysis available</div>;

  return (
    <div>
      <h2>Your Skin Analysis</h2>

      <div className="result">
        <p>
          <strong>Tone:</strong> {result.tone}
        </p>
        <p>
          <strong>Skin Type:</strong> {result.skinType}
        </p>
        <p>
          <strong>Confidence:</strong> {result.confidence}%
        </p>
        <p>{result.description}</p>
      </div>

      <div className="recommendations">
        <h3>Recommended Products</h3>

        <div className="makeup-products">
          <h4>Makeup</h4>
          {result.recommendations.makeup.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="skincare-products">
          <h4>Skincare</h4>
          {result.recommendations.skincare.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

async function dataURLtoFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: 'image/jpeg' });
}
