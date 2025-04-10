
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign, Plus, Filter } from 'lucide-react';
import { mockIncome, mockProjects, getIncomeByType } from '@/services/mockData';
import { toast } from '@/components/ui/use-toast';

const Income = () => {
  const [filter, setFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  
  const [newIncome, setNewIncome] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'salary',
    description: '',
    projectId: ''
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Calculate totals
  const salaryTotal = getIncomeByType('salary');
  const supportTotal = getIncomeByType('support');
  const freelanceTotal = getIncomeByType('freelance');
  const total = salaryTotal + supportTotal + freelanceTotal;
  
  // Data for pie chart
  const chartData = [
    { name: 'Salary', value: salaryTotal },
    { name: 'Support Fees', value: supportTotal },
    { name: 'Freelance', value: freelanceTotal }
  ];
  
  const COLORS = ['#0EA5E9', '#10B981', '#F59E0B'];
  
  // Filter income data
  const filteredIncome = mockIncome.filter(income => {
    // Filter by type
    if (filter !== 'all' && income.type !== filter) return false;
    
    // Filter by month
    if (selectedMonth !== 'all') {
      const [year, month] = selectedMonth.split('-');
      const incomeDate = new Date(income.date);
      if (
        incomeDate.getFullYear() !== parseInt(year) || 
        incomeDate.getMonth() !== parseInt(month) - 1
      ) {
        return false;
      }
    }
    
    return true;
  });
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Income Added",
      description: `${newIncome.type.charAt(0).toUpperCase() + newIncome.type.slice(1)} income of $${newIncome.amount} has been recorded.`,
    });
    
    setIsDialogOpen(false);
    setNewIncome({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'salary',
      description: '',
      projectId: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Income</h2>
          <p className="text-muted-foreground">Manage and track your income sources</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Income</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
              <DialogDescription>
                Record a new income entry. Fill out the details below.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newIncome.date}
                    onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Income Type</Label>
                  <Select 
                    value={newIncome.type} 
                    onValueChange={(value) => setNewIncome({...newIncome, type: value as 'salary' | 'support' | 'freelance'})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select income type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="support">Support Fee</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newIncome.type === 'support' && (
                  <div className="grid gap-2">
                    <Label htmlFor="project">Project</Label>
                    <Select 
                      value={newIncome.projectId} 
                      onValueChange={(value) => setNewIncome({...newIncome, projectId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProjects.filter(p => !p.isForecast).map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Description of income"
                    value={newIncome.description}
                    onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Income</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-money-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All sources</p>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-md font-medium">Income Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Income List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Income Entries</CardTitle>
            
            <div className="flex items-center space-x-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="2025-01">January 2025</SelectItem>
                  <SelectItem value="2025-02">February 2025</SelectItem>
                  <SelectItem value="2025-03">March 2025</SelectItem>
                  <SelectItem value="2025-04">April 2025</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter income" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="support">Support Fees</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
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
                  {filteredIncome.length > 0 ? (
                    filteredIncome.map((income) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="h-24 text-center text-muted-foreground">
                        No income entries match your filters
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-slate-50">
                    <td colSpan={3} className="p-4 align-middle font-medium">Total</td>
                    <td className="p-4 align-middle text-right font-medium">
                      ${filteredIncome.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Income;
