
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, DollarSign, TrendingUp, Briefcase, BarChart3 } from 'lucide-react';
import { mockIncome, mockProjects, getMonthlyIncome, getMonthNames, getForecastIncome } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  
  useEffect(() => {
    // Prepare data for charts
    const monthNames = getMonthNames();
    const incomeValues = getMonthlyIncome();
    const forecastValues = getForecastIncome();
    
    const monthlyChartData = monthNames.map((month, index) => ({
      name: month,
      income: incomeValues[index]
    }));
    
    // Creating forecast data (next 6 months)
    const today = new Date();
    const forecastMonths = [];
    for (let i = 0; i < 6; i++) {
      const month = new Date(today);
      month.setMonth(today.getMonth() + i);
      forecastMonths.push(month.toLocaleDateString('en-US', { month: 'short' }));
    }
    
    const forecastChartData = forecastMonths.map((month, index) => ({
      name: month,
      forecast: forecastValues[index]
    }));
    
    setMonthlyData(monthlyChartData);
    setForecastData(forecastChartData);
  }, []);
  
  // Calculate totals
  const totalMonthlyIncome = mockIncome
    .filter(item => {
      const today = new Date();
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === today.getMonth() && 
             itemDate.getFullYear() === today.getFullYear();
    })
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalIncome = mockIncome.reduce((sum, item) => sum + item.amount, 0);
  const activeProjects = mockProjects.filter(p => p.isActive && !p.isForecast).length;
  const forecastProjects = mockProjects.filter(p => p.isForecast).length;

  // Get user display name from metadata or email
  const displayName = user?.user_metadata?.name || 
                      user?.user_metadata?.full_name || 
                      user?.email?.split('@')[0] || 
                      'User';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {displayName}</h2>
        <p className="text-muted-foreground">Here's an overview of your income stats</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-money-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-money-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-money-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Generating income</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Forecast Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-money-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forecastProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Upcoming</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="income">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Income Analytics</h3>
          <TabsList>
            <TabsTrigger value="income">Income History</TabsTrigger>
            <TabsTrigger value="forecast">Income Forecast</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-money-primary" />
                Monthly Income (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Income']} />
                    <Bar dataKey="income" name="Monthly Income" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-money-warning" />
                Income Forecast (Next 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Forecast']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      name="Forecasted Income"
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Recent Income */}
      <div>
        <h3 className="text-xl font-bold mb-4">Recent Income</h3>
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockIncome.slice(0, 5).map((income) => (
                      <tr key={income.id} className="border-b transition-colors hover:bg-slate-50">
                        <td className="p-4 align-middle">{new Date(income.date).toLocaleDateString()}</td>
                        <td className="p-4 align-middle">{income.description}</td>
                        <td className="p-4 align-middle">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            income.type === 'salary' ? 'bg-blue-100 text-blue-800' : 
                            income.type === 'support' ? 'bg-green-100 text-green-800' : 
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {income.type.charAt(0).toUpperCase() + income.type.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-right font-medium">
                          ${income.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
