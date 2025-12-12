import { supabase } from './supabase';
import type { Prediction } from '../types';

export async function getPredictionByStockId(stockId: string): Promise<Prediction | null> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('stock_id', stockId)
    .order('last_updated', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch prediction: ${error.message}`);
  }

  return data;
}

export async function getPredictionByStockAndModel(
  stockId: string,
  modelId: string
): Promise<Prediction | null> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('stock_id', stockId)
    .eq('model_id', modelId)
    .order('last_updated', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch prediction: ${error.message}`);
  }

  return data;
}

export async function getAllPredictionsByStock(stockId: string): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('stock_id', stockId)
    .order('last_updated', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch predictions: ${error.message}`);
  }

  return data || [];
}

export interface CreatePredictionData {
  stock_id: string;
  model_id?: string;
  price_1d: string;
  change_1d_percent: string;
  direction_1d: 'Up' | 'Down' | 'Neutral';
  price_7d: string;
  change_7d_percent: string;
  direction_7d: 'Up' | 'Down' | 'Neutral';
  price_30d: string;
  change_30d_percent: string;
  direction_30d: 'Up' | 'Down' | 'Neutral';
  confidence_score: string;
  risk_level: 'Low' | 'Medium' | 'High';
  sentiment_score: string;
}

export async function createPrediction(predictionData: CreatePredictionData): Promise<Prediction> {
  const { data, error } = await supabase
    .from('predictions')
    .insert({
      ...predictionData,
      last_updated: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create prediction: ${error.message}`);
  }

  return data;
}

export async function updatePrediction(
  id: string,
  updates: Partial<CreatePredictionData>
): Promise<Prediction> {
  const { data, error } = await supabase
    .from('predictions')
    .update({
      ...updates,
      last_updated: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update prediction: ${error.message}`);
  }

  return data;
}

export async function deletePrediction(id: string): Promise<void> {
  const { error } = await supabase
    .from('predictions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete prediction: ${error.message}`);
  }
}

export async function getPredictionsByModel(modelId: string): Promise<Prediction[]> {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('model_id', modelId)
    .order('last_updated', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch predictions by model: ${error.message}`);
  }

  return data || [];
}

export function isRecentPrediction(prediction: Prediction, hoursThreshold = 24): boolean {
  const lastUpdated = new Date(prediction.last_updated);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
  return hoursDiff < hoursThreshold;
}
