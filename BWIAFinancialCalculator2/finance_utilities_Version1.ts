// Financial mathematics utility functions

export interface InterestRateConversion {
  simple: number;
  effectiveAnnual: number;
  nominal: number;
  effectivePeriodic: number;
  forceOfInterest: number;
}

// Convert simple interest rate to other types
export function convertFromSimple(
  simpleRate: number,
  timePeriod: number,
  compoundingFreq: number = 1
): InterestRateConversion {
  const r = simpleRate / 100;
  const t = timePeriod;
  const m = compoundingFreq;

  // Simple to Effective Annual
  const effectiveAnnual = (1 + r * t) ** (1 / t) - 1;
  
  // Simple to Nominal
  const nominal = m * ((1 + r * t) ** (1 / (m * t)) - 1);
  
  // Simple to Effective Periodic
  const effectivePeriodic = (1 + r * t) ** (1 / (m * t)) - 1;
  
  // Simple to Force of Interest
  const forceOfInterest = Math.log(1 + r * t) / t;

  return {
    simple: simpleRate,
    effectiveAnnual: effectiveAnnual * 100,
    nominal: nominal * 100,
    effectivePeriodic: effectivePeriodic * 100,
    forceOfInterest: forceOfInterest * 100
  };
}

// Convert effective annual rate to other types
export function convertFromEffectiveAnnual(
  effectiveRate: number,
  compoundingFreq: number = 1,
  timePeriod: number = 1
): InterestRateConversion {
  const r = effectiveRate / 100;
  const m = compoundingFreq;
  const t = timePeriod;

  // Effective Annual to Simple
  const simple = ((1 + r) ** t - 1) / t;
  
  // Effective Annual to Nominal
  const nominal = m * ((1 + r) ** (1 / m) - 1);
  
  // Effective Annual to Effective Periodic
  const effectivePeriodic = (1 + r) ** (1 / m) - 1;
  
  // Effective Annual to Force of Interest
  const forceOfInterest = Math.log(1 + r);

  return {
    simple: simple * 100,
    effectiveAnnual: effectiveRate,
    nominal: nominal * 100,
    effectivePeriodic: effectivePeriodic * 100,
    forceOfInterest: forceOfInterest * 100
  };
}

// Convert nominal rate to other types
export function convertFromNominal(
  nominalRate: number,
  compoundingFreq: number,
  targetCompoundingFreq: number = 1
): InterestRateConversion {
  const r = nominalRate / 100;
  const m = compoundingFreq;
  const m2 = targetCompoundingFreq;

  // Nominal to Effective Annual
  const effectiveAnnual = (1 + r / m) ** m - 1;
  
  // Nominal to Simple (assuming 1 year)
  const simple = effectiveAnnual;
  
  // Nominal to different compounding
  const targetNominal = m2 * ((1 + r / m) ** (m / m2) - 1);
  
  // Nominal to Effective Periodic
  const effectivePeriodic = (1 + r / m) ** (m / m2) - 1;
  
  // Nominal to Force of Interest
  const forceOfInterest = Math.log(1 + r / m) * m;

  return {
    simple: simple * 100,
    effectiveAnnual: effectiveAnnual * 100,
    nominal: targetNominal * 100,
    effectivePeriodic: effectivePeriodic * 100,
    forceOfInterest: forceOfInterest * 100
  };
}

// Simple Interest Calculations
export interface SimpleInterestResult {
  principal: number;
  rate: number;
  time: number;
  interest: number;
  futureValue: number;
}

export function calculateSimpleInterest(
  principal?: number,
  rate?: number,
  time?: number,
  futureValue?: number
): SimpleInterestResult {
  if (principal && rate && time) {
    const interest = principal * (rate / 100) * time;
    return {
      principal,
      rate,
      time,
      interest,
      futureValue: principal + interest
    };
  }
  
  if (futureValue && rate && time) {
    const calculatedPrincipal = futureValue / (1 + (rate / 100) * time);
    const interest = futureValue - calculatedPrincipal;
    return {
      principal: calculatedPrincipal,
      rate,
      time,
      interest,
      futureValue
    };
  }
  
  if (principal && futureValue && time) {
    const calculatedRate = ((futureValue - principal) / (principal * time)) * 100;
    const interest = futureValue - principal;
    return {
      principal,
      rate: calculatedRate,
      time,
      interest,
      futureValue
    };
  }
  
  if (principal && rate && futureValue) {
    const calculatedTime = (futureValue - principal) / (principal * (rate / 100));
    const interest = futureValue - principal;
    return {
      principal,
      rate,
      time: calculatedTime,
      interest,
      futureValue
    };
  }

  throw new Error("Insufficient parameters for calculation");
}

// Compound Interest Calculations
export interface CompoundInterestResult {
  principal: number;
  rate: number;
  time: number;
  compoundingFreq: number;
  interest: number;
  futureValue: number;
}

export function calculateCompoundInterest(
  principal?: number,
  rate?: number,
  time?: number,
  compoundingFreq: number = 1,
  futureValue?: number
): CompoundInterestResult {
  if (principal && rate && time) {
    const r = rate / 100;
    const calculatedFV = principal * (1 + r / compoundingFreq) ** (compoundingFreq * time);
    const interest = calculatedFV - principal;
    return {
      principal,
      rate,
      time,
      compoundingFreq,
      interest,
      futureValue: calculatedFV
    };
  }

  if (futureValue && rate && time) {
    const r = rate / 100;
    const calculatedPrincipal = futureValue / ((1 + r / compoundingFreq) ** (compoundingFreq * time));
    const interest = futureValue - calculatedPrincipal;
    return {
      principal: calculatedPrincipal,
      rate,
      time,
      compoundingFreq,
      interest,
      futureValue
    };
  }

  if (principal && futureValue && time) {
    const calculatedRate = compoundingFreq * (((futureValue / principal) ** (1 / (compoundingFreq * time))) - 1) * 100;
    const interest = futureValue - principal;
    return {
      principal,
      rate: calculatedRate,
      time,
      compoundingFreq,
      interest,
      futureValue
    };
  }

  if (principal && rate && futureValue) {
    const r = rate / 100;
    const calculatedTime = Math.log(futureValue / principal) / (compoundingFreq * Math.log(1 + r / compoundingFreq));
    const interest = futureValue - principal;
    return {
      principal,
      rate,
      time: calculatedTime,
      compoundingFreq,
      interest,
      futureValue
    };
  }

  throw new Error("Insufficient parameters for calculation");
}

// Problem 6.4 Solver
export interface Problem64Result {
  firstPayment: number;
  effectiveAnnualRate: number;
  monthlyEffectiveRate: number;
  futureValueInitial: number;
  targetFund: number;
  firstWithdrawal: number;
}

export function solveProblem64(
  nominalRate: number = 12,
  initialInvestment: number = 10000,
  inflationRate: number = 8,
  firstWithdrawalValue: number = 5000,
  investmentYears: number = 40,
  withdrawalYears: number = 20
): Problem64Result {
  // Convert nominal rate to effective rates
  const monthlyNominalRate = nominalRate / 100 / 12;
  const effectiveAnnualRate = (1 + monthlyNominalRate) ** 12 - 1;
  const monthlyEffectiveRate = (1 + effectiveAnnualRate) ** (1/12) - 1;
  
  // Calculate future value of initial investment
  const futureValueInitial = initialInvestment * (1 + effectiveAnnualRate) ** investmentYears;
  
  // Calculate first withdrawal in 2040 terms (inflated)
  const firstWithdrawal = firstWithdrawalValue * (1 + inflationRate / 100) ** investmentYears;
  
  // Calculate present value of all withdrawals at retirement
  const monthlyInflationRate = (1 + inflationRate / 100) ** (1/12) - 1;
  const realMonthlyRate = (1 + monthlyEffectiveRate) / (1 + monthlyInflationRate) - 1;
  
  let pvWithdrawals = 0;
  for (let month = 1; month <= withdrawalYears * 12; month++) {
    const yearNumber = Math.ceil(month / 12);
    const monthlyWithdrawal = firstWithdrawal * (1 + inflationRate / 100) ** (yearNumber - 1);
    pvWithdrawals += monthlyWithdrawal / (1 + monthlyEffectiveRate) ** month;
  }
  
  // Target fund needed at retirement
  const targetFund = pvWithdrawals;
  
  // Calculate required annuity payments
  const requiredFromPayments = targetFund - futureValueInitial;
  
  // Calculate annuity factor for increasing payments
  let annuityFactor = 0;
  for (let month = 1; month <= investmentYears * 12; month++) {
    const yearNumber = Math.ceil(month / 12);
    const inflationFactor = (1 + inflationRate / 100) ** (yearNumber - 1);
    annuityFactor += inflationFactor * (1 + monthlyEffectiveRate) ** (investmentYears * 12 - month);
  }
  
  const firstPayment = requiredFromPayments / annuityFactor;

  return {
    firstPayment,
    effectiveAnnualRate: effectiveAnnualRate * 100,
    monthlyEffectiveRate: monthlyEffectiveRate * 100,
    futureValueInitial,
    targetFund,
    firstWithdrawal
  };
}

// Loan calculations
export interface LoanResult {
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayments: number;
}

export function calculateLoan(
  loanAmount: number,
  annualRate: number,
  termYears: number
): LoanResult {
  const monthlyRate = annualRate / 100 / 12;
  const termMonths = termYears * 12;
  
  const monthlyPayment = loanAmount * 
    (monthlyRate * (1 + monthlyRate) ** termMonths) / 
    ((1 + monthlyRate) ** termMonths - 1);
  
  const totalPayments = monthlyPayment * termMonths;
  const totalInterest = totalPayments - loanAmount;

  return {
    loanAmount,
    interestRate: annualRate,
    termMonths,
    monthlyPayment,
    totalInterest,
    totalPayments
  };
}

// Annuity calculations
export interface AnnuityResult {
  payment: number;
  presentValue: number;
  futureValue: number;
  totalPayments: number;
  totalInterest: number;
}

export function calculateOrdinaryAnnuity(
  payment?: number,
  rate?: number,
  periods?: number,
  presentValue?: number,
  futureValue?: number
): AnnuityResult {
  const r = (rate || 0) / 100;
  const n = periods || 0;

  if (payment && rate && periods) {
    const pv = payment * (1 - (1 + r) ** (-n)) / r;
    const fv = payment * (((1 + r) ** n - 1) / r);
    return {
      payment,
      presentValue: pv,
      futureValue: fv,
      totalPayments: payment * n,
      totalInterest: fv - (payment * n)
    };
  }

  if (presentValue && rate && periods) {
    const pmt = (presentValue * r) / (1 - (1 + r) ** (-n));
    const fv = pmt * (((1 + r) ** n - 1) / r);
    return {
      payment: pmt,
      presentValue,
      futureValue: fv,
      totalPayments: pmt * n,
      totalInterest: fv - (pmt * n)
    };
  }

  if (futureValue && rate && periods) {
    const pmt = (futureValue * r) / ((1 + r) ** n - 1);
    const pv = pmt * (1 - (1 + r) ** (-n)) / r;
    return {
      payment: pmt,
      presentValue: pv,
      futureValue,
      totalPayments: pmt * n,
      totalInterest: futureValue - (pmt * n)
    };
  }

  throw new Error("Insufficient parameters for annuity calculation");
}