/*
  # Update AI Models with Investor-Focused Names
  
  1. Changes
    - Remove existing seeded models
    - Add 4 new models with investor-friendly names
    - Models: Baseline, Ensemble AI, Transformer Pro, Risk-Adjusted
  
  2. New Model Details
    - Each model has distinct characteristics and use cases
    - Accuracy metrics and strengths defined for each
*/

DELETE FROM models;

INSERT INTO models (name, code, description, type, accuracy, strengths, use_cases, is_active) VALUES
(
  'Baseline Model',
  'baseline_v1',
  'Foundation model using traditional statistical methods and technical indicators. Provides reliable baseline predictions with proven track record across market conditions.',
  'statistical',
  82.5,
  ARRAY['Consistent performance', 'Low variance', 'Market fundamentals'],
  ARRAY['Conservative investing', 'Long-term positions', 'Portfolio baseline'],
  true
),
(
  'Ensemble AI Model',
  'ensemble_v1',
  'Advanced ensemble combining multiple neural networks and machine learning algorithms. Aggregates predictions from diverse models for robust and balanced forecasts.',
  'ensemble',
  88.3,
  ARRAY['High accuracy', 'Multi-factor analysis', 'Adaptive learning'],
  ARRAY['Active trading', 'Medium-term holds', 'Diversified strategies'],
  true
),
(
  'Transformer Pro Model',
  'transformer_v1',
  'State-of-the-art transformer architecture with attention mechanisms. Excels at capturing complex market patterns and long-range dependencies for superior predictions.',
  'neural_network',
  91.7,
  ARRAY['Pattern recognition', 'Market context', 'Momentum detection'],
  ARRAY['Day trading', 'Swing trading', 'High-frequency strategies'],
  true
),
(
  'Risk-Adjusted Model',
  'risk_adjusted_v1',
  'Specialized model optimizing for risk-adjusted returns. Balances potential gains with downside protection, ideal for risk-conscious investors seeking stable growth.',
  'hybrid',
  85.9,
  ARRAY['Risk management', 'Downside protection', 'Stable returns'],
  ARRAY['Risk-averse investors', 'Wealth preservation', 'Balanced portfolios'],
  true
)
ON CONFLICT (code) DO NOTHING;
