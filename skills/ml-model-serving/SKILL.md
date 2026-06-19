---
name: "ml-model-serving"
description: "Patterns for serving machine learning models with FastAPI, handling background tasks, and managing GPU memory."
version: "1.0.0"
---

# ML Model Serving

## When to Activate
Activate this skill when building an inference API for a machine learning model using FastAPI.

## How It Works

### 1. Model Initialization
Load models during application startup to avoid loading them per request.

```python
from fastapi import FastAPI
import torch

app = FastAPI()
model = None

@app.on_event("startup")
def load_model():
    global model
    model = MyModel()
    model.load_state_dict(torch.load("best_model.pt"))
    model.eval()
    model.to("cuda")
```

### 2. Inference Route
Use `torch.no_grad()` to save memory during inference.

```python
from pydantic import BaseModel

class InferenceRequest(BaseModel):
    data: list

@app.post("/predict")
async def predict(req: InferenceRequest):
    tensor_data = torch.tensor(req.data).to("cuda")
    with torch.no_grad():
        output = model(tensor_data)
    return {"prediction": output.cpu().numpy().tolist()}
```

### 3. Background Tasks
For long-running inference (like video generation), return a task ID immediately and run inference in the background.

```python
from fastapi import BackgroundTasks

def run_inference(task_id: str, data: list):
    # run inference and save result to DB
    pass

@app.post("/generate")
async def generate(req: InferenceRequest, background_tasks: BackgroundTasks):
    task_id = "12345"
    background_tasks.add_task(run_inference, task_id, req.data)
    return {"task_id": task_id, "status": "processing"}
```
