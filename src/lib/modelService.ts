import { supabase } from './supabase';
import type { Model, ModelType } from '../types';

export async function getActiveModels(): Promise<Model[]> {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('is_active', true)
    .order('accuracy', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch active models: ${error.message}`);
  }

  return data || [];
}

export async function getAllModels(): Promise<Model[]> {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch models: ${error.message}`);
  }

  return data || [];
}

export async function getModelById(id: string): Promise<Model | null> {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch model: ${error.message}`);
  }

  return data;
}

export async function getModelByCode(code: string): Promise<Model | null> {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch model: ${error.message}`);
  }

  return data;
}

export interface CreateModelData {
  name: string;
  code: string;
  description?: string;
  type: ModelType;
  accuracy?: number;
  strengths?: string[];
  use_cases?: string[];
  is_active?: boolean;
}

export async function createModel(modelData: CreateModelData): Promise<Model> {
  const { data, error } = await supabase
    .from('models')
    .insert(modelData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create model: ${error.message}`);
  }

  return data;
}

export interface UpdateModelData {
  name?: string;
  description?: string;
  type?: ModelType;
  accuracy?: number;
  strengths?: string[];
  use_cases?: string[];
  is_active?: boolean;
}

export async function updateModel(id: string, updates: UpdateModelData): Promise<Model> {
  const { data, error } = await supabase
    .from('models')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update model: ${error.message}`);
  }

  return data;
}

export async function deleteModel(id: string): Promise<void> {
  const { error } = await supabase
    .from('models')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete model: ${error.message}`);
  }
}

export async function toggleModelStatus(id: string, isActive: boolean): Promise<Model> {
  return updateModel(id, { is_active: isActive });
}

export function getModelTypeLabel(type: ModelType): string {
  const labels: Record<ModelType, string> = {
    neural_network: 'Neural Network',
    ensemble: 'Ensemble',
    statistical: 'Statistical',
    hybrid: 'Hybrid'
  };
  return labels[type];
}

export function getModelTypeColor(type: ModelType): string {
  const colors: Record<ModelType, string> = {
    neural_network: 'text-cyan-400',
    ensemble: 'text-purple-400',
    statistical: 'text-green-400',
    hybrid: 'text-yellow-400'
  };
  return colors[type];
}
