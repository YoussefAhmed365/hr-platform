export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface PayrollCalculationInput {
  baseSalary: number;
  allowances?: number;
  deductions?: number;
  unpaidLeaveDays?: number;
  overtimeHours?: number;
}

export interface PayrollCalculationResult {
  grossSalary: number;
  taxableIncome: number;
  taxAmount: number;
  socialInsuranceEmployee: number;
  socialInsuranceEmployer: number;
  netSalary: number;
}
