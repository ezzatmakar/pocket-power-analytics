
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  total_fee: number;
  my_percentage: number;
  start_date: string;
  is_active: boolean;
  is_forecast: boolean;
}

interface ForecastProjectTableProps {
  projects: Project[];
}

const ForecastProjectTable = ({ projects }: ForecastProjectTableProps) => {
  // Calculate total projected additional monthly income
  const totalProjectedIncome = projects.reduce((sum, project) => {
    return sum + (Number(project.total_fee) * project.my_percentage / 100);
  }, 0);

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No Forecast Projects</h3>
        <p className="text-muted-foreground">Add forecast projects in the Projects page to see your future income potential.</p>
        <Button 
          onClick={() => window.location.href = '/projects'} 
          className="mt-4"
        >
          Go to Projects
        </Button>
      </div>
    );
  }

  return (
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
            {projects.map(project => (
              <tr key={project.id} className="border-b transition-colors hover:bg-slate-50">
                <td className="p-4 align-middle font-medium">{project.name}</td>
                <td className="p-4 align-middle">
                  {new Date(project.start_date).toLocaleDateString()}
                </td>
                <td className="p-4 align-middle">${Number(project.total_fee).toLocaleString()}</td>
                <td className="p-4 align-middle">{project.my_percentage}%</td>
                <td className="p-4 align-middle text-right font-medium text-money-warning">
                  ${(Number(project.total_fee) * project.my_percentage / 100).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t bg-slate-50">
              <td colSpan={4} className="p-4 align-middle font-medium">Projected Additional Monthly Income</td>
              <td className="p-4 align-middle text-right font-bold text-money-success">
                ${totalProjectedIncome.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ForecastProjectTable;
