
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { TrendingUp, TrendingDown, CandlestickChart, Briefcase } from 'lucide-react';
import { mockProjects, getForecastIncome } from '@/services/mockData';

const Forecasting = () => {
  const [forecastData, setForecastData] = useState<any[]>([]);
  
  useEffect(() => {
    // Get forecast for next 12 months
    const forecastValues = getForecastIncome(12);
    
    // Creating forecast data (next 12 months)
    const today = new Date();
    const forecastMonths = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(today);
      month.setMonth(today.getMonth() + i);
      forecastMonths.push(month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
    }
    
    const forecastChartData = forecastMonths.map((month, index) => {
      let projected = forecastValues[index];
      
      // Calculate a realistic best and worst case
      const bestCase = Math.round(projected * 1.2); // 20% better
      const worstCase = Math.round(projected * 0.8); // 20% worse
      
      return {
        name: month,
        projected,
        bestCase,
        worstCase
      };
    });
    
    setForecastData(forecastChartData);
  }, []);
  
  // Filter forecast projects
  const forecastProjects = mockProjects.filter(p => p.isForecast);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Income Forecasting</h2>
        <p className="text-muted-foreground">Projections and future income analysis</p>
      </div>
      
      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-money-warning" />
            12-Month Income Forecast
          </CardTitle>
          <CardDescription>
            Projected income for the next 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, '']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bestCase" 
                  name="Best Case" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="projected" 
                  name="Projected" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="worstCase" 
                  name="Worst Case" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <ReferenceLine y={5000} label="Base Salary" stroke="#0EA5E9" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Income Range */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CandlestickChart className="h-5 w-5 mr-2 text-money-primary" />
              Monthly Income Range
            </CardTitle>
            <CardDescription>
              Projected income ranges for the next 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData.slice(0, 6)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="projected" name="Projected" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Income Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-money-success" />
              Forecasted Income Growth
            </CardTitle>
            <CardDescription>
              Projected monthly income growth over the next 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData.slice(0, 6)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, '']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="projected"
                    name="Projected Income"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Forecast Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-money-warning" />
            Forecast Projects
          </CardTitle>
          <CardDescription>
            Projects that will contribute to your future income
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forecastProjects.length > 0 ? (
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Project</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Start Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Total Fee</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Your %</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Monthly Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecastProjects.map(project => (
                      <tr key={project.id} className="border-b transition-colors hover:bg-slate-50">
                        <td className="p-4 align-middle font-medium">{project.name}</td>
                        <td className="p-4 align-middle">
                          {new Date(project.startDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle">${project.totalFee.toLocaleString()}</td>
                        <td className="p-4 align-middle">{project.myPercentage}%</td>
                        <td className="p-4 align-middle text-right font-medium text-money-warning">
                          ${(project.totalFee * project.myPercentage / 100).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-slate-50">
                      <td colSpan={4} className="p-4 align-middle font-medium">Projected Additional Monthly Income</td>
                      <td className="p-4 align-middle text-right font-bold text-money-success">
                        ${forecastProjects.reduce((sum, project) => {
                          return sum + (project.totalFee * project.myPercentage / 100);
                        }, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Forecast Projects</h3>
              <p className="text-muted-foreground">Add forecast projects to see your future income potential.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Forecasting;
