import React, { useState } from 'react';

/**
 * Secure Login Form component featuring modern aesthetics (glassmorphism),
 * immutable state management, and strict UI-boundary validation.
 */
export const LoginForm = ({ onSubmit }) => {
  // Immutable state management for form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Independent state for validation errors
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Track submission state for micro-interactions
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Secure validation function.
   * Returns a new error object (immutability) without mutating existing state.
   */
  const validate = (data) => {
    const newErrors = { email: '', password: '' };
    
    // Email validation
    if (!data.email.trim()) {
      newErrors.email = 'Email is required.';
    } else {
      // Basic regex for email pattern validation at the UI boundary
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    // Password validation
    if (!data.password) {
      newErrors.password = 'Password is required.';
    }

    return newErrors;
  };

  /**
   * Input handler using immutable state updates
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Create new object instead of mutating existing state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear the specific error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  /**
   * Form submission handler
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate(formData);
    
    // Check if there are any errors
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    
    if (hasErrors) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Pass data to parent securely
    onSubmit({
      email: formData.email,
      password: formData.password
    });
    
    setIsSubmitting(false);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account securely</p>
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.email ? styles.inputError : {})
            }}
            placeholder="name@company.com"
            autoComplete="email"
          />
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.password ? styles.inputError : {})
            }}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <span style={styles.errorText}>{errors.password}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{
            ...styles.button,
            ...(isSubmitting ? styles.buttonDisabled : {})
          }}
        >
          {isSubmitting ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

// Inline CSS for the demo to avoid external dependencies, simulating rich aesthetics
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px'
  },
  form: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center'
  },
  title: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#8b949e',
    fontSize: '14px',
    margin: 0
  },
  inputGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    color: '#c9d1d9',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px'
  },
  input: {
    background: 'rgba(1, 4, 9, 0.3)',
    border: '1px solid #30363d',
    borderRadius: '8px',
    color: '#c9d1d9',
    padding: '12px 16px',
    fontSize: '15px',
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  inputError: {
    border: '1px solid #f85149',
    background: 'rgba(248, 81, 73, 0.05)'
  },
  errorText: {
    color: '#f85149',
    fontSize: '13px',
    marginTop: '6px'
  },
  button: {
    background: 'linear-gradient(180deg, #2ea043 0%, #238636 100%)',
    border: '1px solid rgba(240, 246, 252, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    padding: '12px 16px',
    width: '100%',
    transition: 'all 0.2s ease',
    marginTop: '10px'
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  }
};
