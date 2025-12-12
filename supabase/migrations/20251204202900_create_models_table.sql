/*
  # Create AI Models Table and Update Predictions

  ## New Tables
  
  ### `models`
  - `id` (uuid, primary key) - Unique identifier for each AI model
  - `name` (text, not null) - Display name of the model (e.g., "LSTM Neural Network")
  - `code` (text, unique, not null) - Unique code identifier (e.g., "lstm_v1")
  - `description` (text) - Detailed description of the model
  - `type` (text, not null) - Model type (neural_network, ensemble, statistical, hybrid)
  - `accuracy` (numeric) - Historical accuracy percentage (0-100)
  - `strengths` (text[]) - Array of model strengths
  - `use_cases` (text[]) - Array of recommended use cases
  - `is_active` (boolean, default true) - Whether model is currently active
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  
  ## Table Modifications
  
  ### `predictions`
  - Add `model_id` (uuid, foreign key to models) - Links prediction to the model that generated it
  
  ## Security
  
  - Enable RLS on `models` table
  - Add policy for authenticated users to read active models
  - Add policy for admin users to manage models
  - Update predictions table to require model_id
  
  ## Seed Data
  
  Seeds 4 default AI models:
  1. LSTM Neural Network - Best for short-term predictions
  2. Transformer Ensemble - Best for medium-term predictions
  3. ARIMA Statistical - Best for stable market conditions
  4. Hybrid ML Model - Balanced predictions
*/

-- Create models table
CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('neural_network', 'ensemble', 'statistical', 'hybrid')),
  accuracy numeric CHECK (accuracy >= 0 AND accuracy <= 100),
  strengths text[] DEFAULT '{}',
  use_cases text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on models
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read active models
CREATE POLICY "Authenticated users can read active models"
  ON models
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Policy: Service role can manage all models (for admin operations)
CREATE POLICY "Service role can manage models"
  ON models
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add model_id column to predictions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'predictions' AND column_name = 'model_id'
  ) THEN
    ALTER TABLE predictions ADD COLUMN model_id uuid REFERENCES models(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index on model_id for better query performance
CREATE INDEX IF NOT EXISTS idx_predictions_model_id ON predictions(model_id);

-- Seed default AI models
INSERT INTO models (name, code, description, type, accuracy, strengths, use_cases) VALUES
(
  'LSTM Neural Network',
  'lstm_v1',
  'Advanced deep learning model using Long Short-Term Memory networks. Excels at identifying complex temporal patterns and short-term price movements.',
  'neural_network',
  87.3,
  ARRAY['Pattern recognition', 'Short-term accuracy', 'Volatility analysis'],
  ARRAY['Day trading', 'Swing trading', 'High volatility stocks']
),
(
  'Transformer Ensemble',
  'transformer_v1',
  'State-of-the-art ensemble model combining multiple transformer architectures. Provides balanced predictions with attention to market context.',
  'ensemble',
  84.6,
  ARRAY['Context awareness', 'Multi-timeframe analysis', 'Robust predictions'],
  ARRAY['Medium-term holds', 'Portfolio planning', 'Diversified strategies']
),
(
  'ARIMA Statistical',
  'arima_v1',
  'Classical statistical model using AutoRegressive Integrated Moving Average. Best for stable market conditions and fundamental analysis.',
  'statistical',
  79.2,
  ARRAY['Trend analysis', 'Stable markets', 'Long-term forecasting'],
  ARRAY['Blue-chip stocks', 'Long-term investing', 'Low volatility markets']
),
(
  'Hybrid ML Model',
  'hybrid_v1',
  'Combines neural networks with statistical methods for balanced predictions. Adapts to various market conditions with consistent performance.',
  'hybrid',
  82.8,
  ARRAY['Adaptability', 'Consistent performance', 'Risk management'],
  ARRAY['All trading styles', 'Mixed portfolios', 'General use']
)
ON CONFLICT (code) DO NOTHING;
