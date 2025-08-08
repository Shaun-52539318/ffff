import { useState } from "react";
import SidebarNavigation from "./sidebar-navigation";
import InterestRateConverter from "./interest-rate-converter";
import SimpleInterestCalculator from "./simple-interest-calculator";
import CompoundInterestCalculator from "./compound-interest-calculator";
import LoanCalculator from "./loan-calculator";
import AnnuitiesCalculator from "./annuities-calculator";
import ProblemSolver from "./problem-solver";
import { Button } from "@/components/ui/button";
import { Calculator, Save, Share } from "lucide-react";

type Section = 
  | "interest-conversion"
  | "simple-interest" 
  | "compound-interest"
  | "loan-calculator"
  | "annuities"
  | "problem-solver";

const sectionTitles: Record<Section, { title: string; description: string }> = {
  "interest-conversion": {
    title: "Interest Rate Conversion",
    description: "Convert between different interest rate types"
  },
  "simple-interest": {
    title: "Simple Interest Calculator",
    description: "Calculate simple interest for investments and loans"
  },
  "compound-interest": {
    title: "Compound Interest Calculator", 
    description: "Calculate compound interest with various compounding frequencies"
  },
  "loan-calculator": {
    title: "Loan Calculator",
    description: "Calculate loan payments and amortization schedules"
  },
  "annuities": {
    title: "Annuities Calculator",
    description: "Calculate present and future values of annuities"
  },
  "problem-solver": {
    title: "Problem 6.4 Solver",
    description: "Solve the student investment scenario with parameter analysis"
  }
};

export default function FinancialCalculator() {
  const [activeSection, setActiveSection] = useState<Section>("interest-conversion");

  const renderSection = () => {
    switch (activeSection) {
      case "interest-conversion":
        return <InterestRateConverter />;
      case "simple-interest":
        return <SimpleInterestCalculator />;
      case "compound-interest":
        return <CompoundInterestCalculator />;
      case "loan-calculator":
        return <LoanCalculator />;
      case "annuities":
        return <AnnuitiesCalculator />;
      case "problem-solver":
        return <ProblemSolver />;
      default:
        return <InterestRateConverter />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calculator className="text-blue-600 mr-3" size={28} />
            Financial Calculator
          </h1>
          <p className="text-sm text-gray-600 mt-1">Advanced Financial Computation Suite</p>
        </div>
        
        <SidebarNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {sectionTitles[activeSection].title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {sectionTitles[activeSection].description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Save className="mr-2" size={16} />
                Save Session
              </Button>
              <Button size="sm">
                <Share className="mr-2" size={16} />
                Share Results
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}