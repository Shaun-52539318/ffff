import { ArrowRightLeft, Percent, TrendingUp, Home, Coins, PuzzleIcon, HelpCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Section = 
  | "interest-conversion"
  | "simple-interest" 
  | "compound-interest"
  | "loan-calculator"
  | "annuities"
  | "problem-solver";

interface SidebarNavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const navigationItems = [
  {
    id: "interest-conversion" as Section,
    label: "Interest Rate Conversion",
    icon: ArrowRightLeft
  },
  {
    id: "simple-interest" as Section,
    label: "Simple Interest",
    icon: Percent
  },
  {
    id: "compound-interest" as Section,
    label: "Compound Interest", 
    icon: TrendingUp
  },
  {
    id: "loan-calculator" as Section,
    label: "Loan Calculator",
    icon: Home
  },
  {
    id: "annuities" as Section,
    label: "Annuities",
    icon: Coins
  },
  {
    id: "problem-solver" as Section,
    label: "Problem 6.4 Solver",
    icon: PuzzleIcon
  }
];

export default function SidebarNavigation({ activeSection, onSectionChange }: SidebarNavigationProps) {
  return (
    <nav className="flex-1 p-4 space-y-2">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : 'inactive'}`}
            >
              <Icon className="mr-3" size={20} />
              {item.label}
            </button>
          );
        })}
      </div>
      
      <div className="pt-4 border-t border-gray-200 mt-4">
        <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center">
          <HelpCircle className="mr-3" size={16} />
          Help & Documentation
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center">
          <Download className="mr-3" size={16} />
          Export Results
        </button>
      </div>
    </nav>
  );
}