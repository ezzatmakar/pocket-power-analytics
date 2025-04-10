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
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ForecastProjectTable from '@/components/forecasting/ForecastProjectTable';

interface Project {
  id: string;
  name: string;
  total_fee: number;
  my_percentage: number;
  start_date: string;
  is_active: boolean;
  is_forecast: boolean;
}

interface ForecastData {
  name: string;
  projected: number;
  bestCase: number;
  worstCase: number;
}

const Forecasting = () => {
  const { user } = useAuth();
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  // Fetch forecast projects from Supabase
  const { data: forecastProjects = [], isLoading, error } = useQuery({
    queryKey: ['forecastProjects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("projects")
        .select('*')
        .eq('is_forecast', true)
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching forecast projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load forecast projects',
          variant: 'destructive',
        });
        return [];
      }
      
      return data as Project[];
    },
    enabled: !!user,
  });

  // Calculate forecast data based on projects
  useEffect(() => {
    if (!forecastProjects?.length) {
      generateSampleForecastData();
      return;
    }

    const today = new Date();
    const forecastMonths = [];
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(today);
      month.setMonth(today.getMonth() + i);
      forecastMonths.push(month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
    }

    const baseSalary = 5000;

    const forecastChartData = forecastMonths.map((month, index) => {
      const monthDate = new Date(today);
      monthDate.setMonth(today.getMonth() + index);

      const activeProjectsInMonth = forecastProjects.filter(project => {
        const projectStartDate = new Date(project.start_date);
        return projectStartDate <= monthDate && project.is_active;
      });

      let projectIncome = activeProjectsInMonth.reduce((sum, project) => {
        return sum + (project.total_fee * project.my_percentage / 100);
      }, 0);

      let projected = baseSalary + projectIncome;
      
      const bestCase = Math.round(projected * 1.2);
      const worstCase = Math.round(projected * 0.8);
      
      return {
        name: month,
        projected,
        bestCase,
        worstCase
      };
    });
    
    setForecastData(forecastChartData);
  }, [forecastProjects]);

  const generateSampleForecastData = () => {
    const today = new Date();
    const forecastMonths = [];
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(today);
      month.setMonth(today.getMonth() + i);
      forecastMonths.push(month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
    }
    
    let baseSalary = 5000;
    const forecastChartData = forecastMonths.map((month, index) => {
      const projected = baseSalary + (index * 200);
      
      return {
        name: month,
        projected,
        bestCase: Math.round(projected * 1.2),
        worstCase: Math.round(projected * 0.8)
      };
    });
    
    setForecastData(forecastChartData);
  };

  const totalProjectedIncome = forecastProjects?.reduce((sum, project) => {
    return sum + (project.total_fee * project.my_percentage / 100);
  }, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-money-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Income Forecasting</h2>
        <p className="text-muted-foreground">Projections and future income analysis</p>
      </div>
      
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
          <ForecastProjectTable projects={forecastProjects} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Forecasting;
