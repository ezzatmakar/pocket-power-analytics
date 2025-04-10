
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { mockIncome, mockProjects, getMonthlyIncome, getMonthNames, getIncomeByType } from '@/services/mockData';

// Define an interface for monthly chart data to fix TypeScript errors
interface MonthlyChartData {
  name: string;
  total: number;
  salary: number;
  support: number;
  freelance: number;
}

// Define an interface for income distribution data
interface IncomeDistributionData {
  name: string;
  value: number;
}

// Define an interface for yearly trend data
interface YearlyTrendData {
  name: string;
  income: number;
}

const Analytics = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyChartData[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyTrendData[]>([]);
  const [incomeDistribution, setIncomeDistribution] = useState<IncomeDistributionData[]>([]);
  
  useEffect(() => {
    // Prepare monthly data for charts
    const monthNames = getMonthNames();
    const incomeValues = getMonthlyIncome();
    
    const monthlyChartData = monthNames.map((month, index) => {
      // Initialize with all required properties to satisfy TypeScript
      const data: MonthlyChartData = {
        name: month,
        total: incomeValues[index],
        salary: 0,
        support: 0,
        freelance: 0
      };
      
      // Count income by type for this month
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - (5 - index));
      const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      const monthIncome = mockIncome.filter(item => item.date.startsWith(yearMonth));
      
      data.salary = monthIncome
        .filter(item => item.type === 'salary')
        .reduce((sum, item) => sum + item.amount, 0);
        
      data.support = monthIncome
        .filter(item => item.type === 'support')
        .reduce((sum, item) => sum + item.amount, 0);
        
      data.freelance = monthIncome
        .filter(item => item.type === 'freelance')
        .reduce((sum, item) => sum + item.amount, 0);
      
      return data;
    });
    
    // Calculate income distribution
    const salaryTotal = getIncomeByType('salary');
    const supportTotal = getIncomeByType('support');
    const freelanceTotal = getIncomeByType('freelance');
    
    const distributionData: IncomeDistributionData[] = [
      { name: 'Salary', value: salaryTotal },
      { name: 'Support Fees', value: supportTotal },
      { name: 'Freelance', value: freelanceTotal }
    ];
    
    // Calculate yearly data
    const currentYear = new Date().getFullYear();
    const yearData: YearlyTrendData[] = [
      { name: (currentYear - 2).toString(), income: 48000 },
      { name: (currentYear - 1).toString(), income: 62000 },
      { name: currentYear.toString(), income: 78000 }
    ];
    
    setMonthlyData(monthlyChartData);
    setIncomeDistribution(distributionData);
    setYearlyData(yearData);
  }, []);
  
  const COLORS = ['#0EA5E9', '#10B981', '#F59E0B'];
  
  // Calculate project contributions
  const projectContributions = mockProjects
    .filter(p => !p.isForecast)
    .map(project => {
      const monthlyContribution = project.totalFee * (project.myPercentage / 100);
      return {
        name: project.name,
        value: monthlyContribution
      };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Deep insights into your income patterns</p>
      </div>
      
      {/* Monthly Income Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-money-primary" />
            Monthly Income Breakdown
          </CardTitle>
          <CardDescription>
            Past 6 months income by source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="salary" stackId="a" name="Salary" fill="#0EA5E9" />
                <Bar dataKey="support" stackId="a" name="Support Fees" fill="#10B981" />
                <Bar dataKey="freelance" stackId="a" name="Freelance" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-money-primary" />
              Income by Source
            </CardTitle>
            <CardDescription>
              Distribution of income across different sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Yearly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-money-primary" />
              Yearly Income Trend
            </CardTitle>
            <CardDescription>
              Year over year income growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Annual Income']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    name="Annual Income"
                    stroke="#0EA5E9" 
                    strokeWidth={2}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Project Contribution */}
      <Card>
        <CardHeader>
          <CardTitle>Project Contribution</CardTitle>
          <CardDescription>
            Monthly income contribution by project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Project</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Total Fee</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Your %</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Your Share</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">% of Income</th>
                  </tr>
                </thead>
                <tbody>
                  {projectContributions.map((project, index) => {
                    const projectData = mockProjects.find(p => p.name === project.name);
                    const totalMonthlyIncome = projectContributions.reduce((sum, p) => sum + p.value, 0) + 5000; // Add base salary
                    const percentOfIncome = (project.value / totalMonthlyIncome * 100).toFixed(1);
                    
                    return (
                      <tr key={index} className="border-b transition-colors hover:bg-slate-50">
                        <td className="p-4 align-middle font-medium">{project.name}</td>
                        <td className="p-4 align-middle">
                          ${projectData ? projectData.totalFee.toLocaleString() : 'N/A'}
                        </td>
                        <td className="p-4 align-middle">
                          {projectData ? `${projectData.myPercentage}%` : 'N/A'}
                        </td>
                        <td className="p-4 align-middle text-right font-medium">
                          ${project.value.toLocaleString()}
                        </td>
                        <td className="p-4 align-middle text-right font-medium">
                          {percentOfIncome}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
