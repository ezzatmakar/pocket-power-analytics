
// Mock data for development purposes

export interface Project {
  id: string;
  name: string;
  totalFee: number;
  myPercentage: number;
  startDate: string;
  isActive: boolean;
  isForecast: boolean;
}

export interface Income {
  id: string;
  amount: number;
  date: string;
  type: 'salary' | 'support' | 'freelance';
  description: string;
  projectId?: string;
}

// Generate projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website',
    totalFee: 4000,
    myPercentage: 25,
    startDate: '2025-01-15',
    isActive: true,
    isForecast: false,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    totalFee: 6000,
    myPercentage: 20,
    startDate: '2025-01-01',
    isActive: true,
    isForecast: false,
  },
  {
    id: '3',
    name: 'CRM System',
    totalFee: 5000,
    myPercentage: 15,
    startDate: '2025-01-01',
    isActive: true,
    isForecast: false,
  },
  {
    id: '4',
    name: 'Banking Platform',
    totalFee: 8000,
    myPercentage: 10,
    startDate: '2025-04-01',
    isActive: true,
    isForecast: true,
  },
  {
    id: '5',
    name: 'Educational Portal',
    totalFee: 3500,
    myPercentage: 30,
    startDate: '2025-05-01',
    isActive: true,
    isForecast: true,
  },
];

// Generate income entries for the past 6 months
export const generateMockIncome = (): Income[] => {
  const income: Income[] = [];
  const today = new Date();
  
  // Generate 6 monthly salaries
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    income.push({
      id: `salary-${i}`,
      amount: 5000,
      date: date.toISOString().split('T')[0],
      type: 'salary',
      description: 'Monthly Salary',
    });
  }
  
  // Generate support fees from each active project for past 3 months
  mockProjects.filter(p => p.isActive && !p.isForecast).forEach(project => {
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      income.push({
        id: `support-${project.id}-${i}`,
        amount: project.totalFee * (project.myPercentage / 100),
        date: date.toISOString().split('T')[0],
        type: 'support',
        description: `Support fee - ${project.name}`,
        projectId: project.id,
      });
    }
  });
  
  // Generate some freelance income
  const freelanceAmounts = [1200, 800, 1500, 950, 2000];
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    income.push({
      id: `freelance-${i}`,
      amount: freelanceAmounts[i],
      date: date.toISOString().split('T')[0],
      type: 'freelance',
      description: `Freelance project ${i + 1}`,
    });
  }
  
  return income.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockIncome = generateMockIncome();

// Helper functions to calculate statistics
export const getMonthlyTotal = (month: string, incomeData = mockIncome): number => {
  return incomeData
    .filter(item => item.date.startsWith(month))
    .reduce((sum, item) => sum + item.amount, 0);
};

export const getIncomeByType = (type: 'salary' | 'support' | 'freelance', incomeData = mockIncome): number => {
  return incomeData
    .filter(item => item.type === type)
    .reduce((sum, item) => sum + item.amount, 0);
};

export const getMonthNames = (count: number = 6): string[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const monthNames = [];
  
  for (let i = 0; i < count; i++) {
    const monthIndex = (today.getMonth() - i + 12) % 12;
    monthNames.unshift(months[monthIndex]);
  }
  
  return monthNames;
};

export const getMonthlyIncome = (count: number = 6, incomeData = mockIncome): number[] => {
  const today = new Date();
  const monthlyIncome = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const total = incomeData
      .filter(item => item.date.startsWith(`${year}-${month}`))
      .reduce((sum, item) => sum + item.amount, 0);
      
    monthlyIncome.unshift(total);
  }
  
  return monthlyIncome;
};

export const getForecastIncome = (months: number = 6): number[] => {
  const result = [];
  const activeProjects = mockProjects.filter(p => p.isActive);
  const monthlySalary = 5000;
  
  const supportFeesByMonth: {[key: number]: number} = {};
  
  // Calculate support fees by month
  activeProjects.forEach(project => {
    const startDate = new Date(project.startDate);
    const startMonth = startDate.getMonth();
    const currentDate = new Date();
    
    for (let i = 0; i < months; i++) {
      const targetMonth = (currentDate.getMonth() + i) % 12;
      
      // Only include if project has started by this month
      if (!project.isForecast || targetMonth >= startMonth) {
        const monthlyFee = project.totalFee * (project.myPercentage / 100);
        supportFeesByMonth[i] = (supportFeesByMonth[i] || 0) + monthlyFee;
      }
    }
  });
  
  // Calculate total projected income by month
  for (let i = 0; i < months; i++) {
    // Base: salary + support fees
    let monthTotal = monthlySalary + (supportFeesByMonth[i] || 0);
    
    // Add estimated freelance (average of past freelance)
    const freelanceItems = mockIncome.filter(item => item.type === 'freelance');
    const avgFreelance = freelanceItems.length ? 
      freelanceItems.reduce((sum, item) => sum + item.amount, 0) / freelanceItems.length : 0;
    
    monthTotal += avgFreelance;
    
    result.push(Math.round(monthTotal));
  }
  
  return result;
};
