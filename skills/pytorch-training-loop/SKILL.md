---
name: "pytorch-training-loop"
description: "Best practices for writing PyTorch training loops, handling precision, accumulation, and logging."
version: "1.0.0"
---

# PyTorch Training Loop Patterns

## When to Activate
Activate this skill when writing or refactoring PyTorch training scripts, especially for deep learning models, LLM fine-tuning, or large-scale computer vision models.

## How It Works
A production-ready PyTorch training loop requires careful handling of gradients, memory, logging, and reproducibility.

### 1. Reproducibility
Always seed everything before creating models or dataloaders.
```python
import torch
import random
import numpy as np

def seed_everything(seed=42):
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
```

### 2. Mixed Precision & Gradient Accumulation
```python
scaler = torch.cuda.amp.GradScaler()
gradient_accumulation_steps = 4

for epoch in range(epochs):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        
        with torch.cuda.amp.autocast():
            output = model(data)
            loss = criterion(output, target)
            loss = loss / gradient_accumulation_steps
            
        scaler.scale(loss).backward()
        
        if (batch_idx + 1) % gradient_accumulation_steps == 0:
            scaler.step(optimizer)
            scaler.update()
            optimizer.zero_grad()
```

### 3. Validation & Checkpointing
Use `torch.no_grad()` and `model.eval()` to save GPU memory during evaluation. Save the `state_dict`, not the whole model object.
```python
model.eval()
val_loss = 0
with torch.no_grad():
    for data, target in val_loader:
        data, target = data.to(device), target.to(device)
        output = model(data)
        val_loss += criterion(output, target).item()

if val_loss < best_loss:
    best_loss = val_loss
    torch.save({
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'loss': best_loss,
    }, 'best_model.pt')
```
