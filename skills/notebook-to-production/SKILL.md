---
name: "notebook-to-production"
description: "Patterns for converting exploratory Jupyter notebooks into solid, maintainable Python scripts."
version: "1.0.0"
---

# Notebook to Production Patterns

## When to Activate
Activate this skill when a user asks to convert an `.ipynb` file to a `.py` script or to "productionize" their notebook code.

## How It Works

### 1. Remove Globals and Encapsulate Logic
Notebooks rely heavily on global state. Move logic into functions or classes.

**Bad (Notebook style):**
```python
df = pd.read_csv("data.csv")
df['new_col'] = df['old_col'] * 2
print(df.head())
```

**Good (Production style):**
```python
def process_data(file_path: str) -> pd.DataFrame:
    df = pd.read_csv(file_path)
    df['new_col'] = df['old_col'] * 2
    return df

if __name__ == "__main__":
    processed_df = process_data("data.csv")
```

### 2. Argument Parsing
Replace hardcoded variables at the top of notebooks with CLI arguments.

```python
import argparse

def main(input_path: str, output_path: str):
    df = process_data(input_path)
    df.to_csv(output_path, index=False)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process data")
    parser.add_argument("--input", required=True, help="Input CSV path")
    parser.add_argument("--output", required=True, help="Output CSV path")
    args = parser.parse_args()
    
    main(args.input, args.output)
```

### 3. Replace Print with Logging
Use Python's built-in `logging` module instead of `print()`.

```python
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

logger.info("Starting data processing...")
```
