import { IPredictionEngine } from '../../types/prediction';
import { mockPredictionEngine } from './mockEngine';
import { demoPredictionEngine } from './demoEngine';

class PredictionEngineFactory {
  private currentEngine: IPredictionEngine;
  private isDemoMode: boolean = false;

  constructor() {
    this.currentEngine = mockPredictionEngine;
  }

  getEngine(): IPredictionEngine {
    return this.isDemoMode ? demoPredictionEngine : this.currentEngine;
  }

  setEngine(engine: IPredictionEngine): void {
    this.currentEngine = engine;
  }

  setDemoMode(enabled: boolean): void {
    this.isDemoMode = enabled;
  }

  isDemoModeEnabled(): boolean {
    return this.isDemoMode;
  }

  async loadTensorFlowModel(modelPath: string): Promise<void> {
    throw new Error('TensorFlow integration not yet implemented. Model path: ' + modelPath);
  }

  async loadPyTorchModel(modelPath: string): Promise<void> {
    throw new Error('PyTorch integration not yet implemented. Model path: ' + modelPath);
  }

  async loadONNXModel(modelPath: string): Promise<void> {
    throw new Error('ONNX integration not yet implemented. Model path: ' + modelPath);
  }

  getAvailableEngines(): string[] {
    return ['mock', 'demo'];
  }
}

export const predictionEngineFactory = new PredictionEngineFactory();

export const getPredictionEngine = (): IPredictionEngine => {
  return predictionEngineFactory.getEngine();
};

export * from './mockEngine';
export * from './demoEngine';
export * from '../../types/prediction';
