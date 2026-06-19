---
name: "streamlit-dashboard"
description: "Best practices for building data applications and machine learning demos using Streamlit."
version: "1.0.0"
---

# Streamlit Dashboard Patterns

## When to Activate
Activate this skill when building interactive dashboards, data apps, or AI model demos using `streamlit`.

## How It Works

### 1. Caching
Use caching to avoid reloading data or models on every interaction.
- Use `@st.cache_data` for dataframes and serializable objects.
- Use `@st.cache_resource` for global resources like ML models or database connections.

```python
import streamlit as st
import pandas as pd
import torch

@st.cache_resource
def load_model():
    model = MyModel()
    model.eval()
    return model

@st.cache_data
def load_data():
    return pd.read_csv("dataset.csv")

model = load_model()
df = load_data()
```

### 2. Session State
Manage complex interactions using `st.session_state`.

```python
if 'step' not in st.session_state:
    st.session_state.step = 1

if st.button("Next Step"):
    st.session_state.step += 1

st.write(f"Currently on step {st.session_state.step}")
```

### 3. Layouts
Use columns and expanders to organize the UI cleanly.

```python
col1, col2 = st.columns(2)

with col1:
    st.header("Inputs")
    user_input = st.text_input("Enter text")

with col2:
    st.header("Outputs")
    if user_input:
        st.write(f"Processed: {user_input.upper()}")

with st.expander("Advanced Settings"):
    st.slider("Threshold", 0.0, 1.0, 0.5)
```
