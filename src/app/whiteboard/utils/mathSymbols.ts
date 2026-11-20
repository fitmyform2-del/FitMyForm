export interface MathCategory {
  title: string;
  symbols: { label: string; symbol: string; preview: string }[];
}

export const MATH_CATEGORIES: MathCategory[] = [
  {
    title: 'Basic & Arithmetic',
    symbols: [
      { label: 'Plus-Minus', symbol: '±', preview: '±' },
      { label: 'Multiply', symbol: '×', preview: '×' },
      { label: 'Divide', symbol: '÷', preview: '÷' },
      { label: 'Equal', symbol: '=', preview: '=' },
      { label: 'Not Equal', symbol: '≠', preview: '≠' },
      { label: 'Approx', symbol: '≈', preview: '≈' },
      { label: 'Less Than Equal', symbol: '≤', preview: '≤' },
      { label: 'Greater Than Equal', symbol: '≥', preview: '≥' },
      { label: 'Much Less', symbol: '≪', preview: '≪' },
      { label: 'Much Greater', symbol: '≫', preview: '≫' },
      { label: 'Infinity', symbol: '∞', preview: '∞' },
      { label: 'Percent', symbol: '%', preview: '%' }
    ]
  },
  {
    title: 'Fractions & Powers',
    symbols: [
      { label: 'Square Root', symbol: '√', preview: '√x' },
      { label: 'Cube Root', symbol: '∛', preview: '∛x' },
      { label: 'Squared', symbol: '²', preview: 'x²' },
      { label: 'Cubed', symbol: '³', preview: 'x³' },
      { label: 'Exponent n', symbol: 'ⁿ', preview: 'xⁿ' },
      { label: 'Half', symbol: '½', preview: '½' },
      { label: 'One Third', symbol: '⅓', preview: '⅓' },
      { label: 'Two Thirds', symbol: '⅔', preview: '⅔' },
      { label: 'One Quarter', symbol: '¼', preview: '¼' },
      { label: 'Three Quarters', symbol: '¾', preview: '¾' }
    ]
  },
  {
    title: 'Calculus & Algebra',
    symbols: [
      { label: 'Summation', symbol: '∑', preview: '∑' },
      { label: 'Integral', symbol: '∫', preview: '∫' },
      { label: 'Double Integral', symbol: '∬', preview: '∬' },
      { label: 'Partial Derivative', symbol: '∂', preview: '∂' },
      { label: 'Delta', symbol: 'Δ', preview: 'Δ' },
      { label: 'Nabla / Gradient', symbol: '∇', preview: '∇' },
      { label: 'Product', symbol: '∏', preview: '∏' },
      { label: 'Factorial', symbol: '!', preview: 'n!' }
    ]
  },
  {
    title: 'Greek Letters',
    symbols: [
      { label: 'Alpha', symbol: 'α', preview: 'α' },
      { label: 'Beta', symbol: 'β', preview: 'β' },
      { label: 'Gamma', symbol: 'γ', preview: 'γ' },
      { label: 'Delta', symbol: 'δ', preview: 'δ' },
      { label: 'Theta', symbol: 'θ', preview: 'θ' },
      { label: 'Lambda', symbol: 'λ', preview: 'λ' },
      { label: 'Mu', symbol: 'μ', preview: 'μ' },
      { label: 'Pi', symbol: 'π', preview: 'π' },
      { label: 'Sigma', symbol: 'σ', preview: 'σ' },
      { label: 'Omega', symbol: 'ω', preview: 'ω' },
      { label: 'Phi', symbol: 'φ', preview: 'φ' },
      { label: 'Psi', symbol: 'ψ', preview: 'ψ' }
    ]
  },
  {
    title: 'Common Formulas',
    symbols: [
      { label: 'Pythagorean', symbol: 'a² + b² = c²', preview: 'a² + b² = c²' },
      { label: 'Area Circle', symbol: 'A = πr²', preview: 'A = πr²' },
      { label: 'Perimeter Circle', symbol: 'C = 2πr', preview: 'C = 2πr' },
      { label: 'Quadratic Formula', symbol: 'x = (-b ± √(b² - 4ac)) / (2a)', preview: 'x = (-b ± √Δ)/2a' },
      { label: 'Euler Identity', symbol: 'e^(iπ) + 1 = 0', preview: 'e^(iπ) + 1 = 0' },
      { label: 'Einstein Mass-Energy', symbol: 'E = mc²', preview: 'E = mc²' },
      { label: 'Slope Intercept', symbol: 'y = mx + b', preview: 'y = mx + b' }
    ]
  }
];
