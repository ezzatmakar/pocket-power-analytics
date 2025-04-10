
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, Plus, MoreVertical, Edit, Trash, Check, X, Search, ArrowDown, ArrowUp, Filter, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

// Type definition for project data
interface Project {
  id: string;
  name: string;
  total_fee: number;
  my_percentage: number;
  start_date: string;
  is_active: boolean;
  is_forecast: boolean;
}

// Type definition for sort config
interface SortConfig {
  key: keyof Project | null;
  direction: 'asc' | 'desc';
}

const Projects = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'desc'
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const [newProject, setNewProject] = useState({
    name: '',
    total_fee: '',
    my_percentage: '',
    start_date: new Date().toISOString().split('T')[0],
    is_active: true,
    is_forecast: false
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to fetch projects. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a project.",
        variant: "destructive"
      });
      return;
    }

    try {
      const projectData = {
        name: newProject.name,
        total_fee: Number(newProject.total_fee),
        my_percentage: Number(newProject.my_percentage),
        start_date: newProject.start_date,
        is_active: newProject.is_active,
        is_forecast: newProject.is_forecast,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (error) {
        throw error;
      }

      setProjects([...projects, data[0]]);
      
      toast({
        title: "Project Added",
        description: `${newProject.name} has been added to your ${newProject.is_forecast ? 'forecast' : 'current'} projects.`,
      });
      
      setIsDialogOpen(false);
      setNewProject({
        name: '',
        total_fee: '',
        my_percentage: '',
        start_date: new Date().toISOString().split('T')[0],
        is_active: true,
        is_forecast: false
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle project actions
  const handleProjectAction = async (action: string, projectId: string, projectName: string) => {
    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId);

        if (error) throw error;

        setProjects(projects.filter(project => project.id !== projectId));
        
        toast({
          title: "Project Deleted",
          description: `${projectName} has been removed from your projects.`,
        });
      } else if (action === 'edit') {
        // For now, just show a toast - edit functionality would be implemented in a separate dialog
        toast({
          title: "Edit Project",
          description: `You can now edit ${projectName}.`,
        });
      } else if (action === 'toggle') {
        const projectToUpdate = projects.find(project => project.id === projectId);
        if (!projectToUpdate) return;

        const { error } = await supabase
          .from('projects')
          .update({ is_active: !projectToUpdate.is_active })
          .eq('id', projectId);

        if (error) throw error;

        setProjects(projects.map(project => 
          project.id === projectId 
            ? { ...project, is_active: !project.is_active } 
            : project
        ));
        
        toast({
          title: "Project Status Updated",
          description: `${projectName} has been ${projectToUpdate.is_active ? 'deactivated' : 'activated'}.`,
        });
      } else if (action === 'convert') {
        const { error } = await supabase
          .from('projects')
          .update({ is_forecast: false })
          .eq('id', projectId);

        if (error) throw error;

        setProjects(projects.map(project => 
          project.id === projectId 
            ? { ...project, is_forecast: false } 
            : project
        ));
        
        toast({
          title: "Project Converted",
          description: `${projectName} has been converted to a current project.`,
        });
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} project. Please try again.`,
        variant: "destructive"
      });
    }
  };
  
  // Handle sorting
  const handleSort = (key: keyof Project) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Handle filtering
  const handleFilter = (status: string | null) => {
    setStatusFilter(status);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Apply sorting, filtering and search
  useEffect(() => {
    let result = [...projects];
    
    // Filter by tab
    result = result.filter(project => {
      if (activeTab === 'current') return !project.is_forecast;
      if (activeTab === 'forecast') return project.is_forecast;
      return true;
    });
    
    // Apply search
    if (searchQuery) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      if (statusFilter === 'active') {
        result = result.filter(project => project.is_active);
      } else if (statusFilter === 'inactive') {
        result = result.filter(project => !project.is_active);
      }
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valueA = a[sortConfig.key as keyof Project];
        const valueB = b[sortConfig.key as keyof Project];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortConfig.direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortConfig.direction === 'asc'
            ? valueA - valueB
            : valueB - valueA;
        }
        
        if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
          return sortConfig.direction === 'asc'
            ? (valueA ? 1 : 0) - (valueB ? 1 : 0)
            : (valueB ? 1 : 0) - (valueA ? 1 : 0);
        }
        
        return 0;
      });
    }
    
    setFilteredProjects(result);
  }, [projects, activeTab, searchQuery, statusFilter, sortConfig]);

  // Get sort icon for table headers
  const getSortIcon = (key: keyof Project) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-money-primary" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your income-generating projects</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a new project to track support fees.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="totalFee">Total Monthly Fee ($)</Label>
                  <Input
                    id="totalFee"
                    type="number"
                    placeholder="0.00"
                    value={newProject.total_fee}
                    onChange={(e) => setNewProject({...newProject, total_fee: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="myPercentage">Your Percentage (%)</Label>
                  <Input
                    id="myPercentage"
                    type="number"
                    placeholder="0"
                    min="1"
                    max="100"
                    value={newProject.my_percentage}
                    onChange={(e) => setNewProject({...newProject, my_percentage: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({...newProject, start_date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="isForecast">Add as Forecast Project</Label>
                  <Switch
                    id="isForecast"
                    checked={newProject.is_forecast}
                    onCheckedChange={(checked) => setNewProject({...newProject, is_forecast: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active Project</Label>
                  <Switch
                    id="isActive"
                    checked={newProject.is_active}
                    onCheckedChange={(checked) => setNewProject({...newProject, is_active: checked})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Projects Tabs */}
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="current">Current Projects</TabsTrigger>
          <TabsTrigger value="forecast">Forecast Projects</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-wrap gap-2 items-center justify-between mt-6">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFilter(null)}>
                {!statusFilter && <Check className="mr-2 h-4 w-4" />}
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('active')}>
                {statusFilter === 'active' && <Check className="mr-2 h-4 w-4" />}
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter('inactive')}>
                {statusFilter === 'inactive' && <Check className="mr-2 h-4 w-4" />}
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <TabsContent value="current" className="mt-2">
          {filteredProjects.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Project Name {getSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('start_date')}
                      >
                        <div className="flex items-center">
                          Start Date {getSortIcon('start_date')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('total_fee')}
                      >
                        <div className="flex items-center">
                          Total Fee {getSortIcon('total_fee')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('my_percentage')}
                      >
                        <div className="flex items-center">
                          Your % {getSortIcon('my_percentage')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('is_active')}
                      >
                        <div className="flex items-center">
                          Status {getSortIcon('is_active')}
                        </div>
                      </TableHead>
                      <TableHead>Your Share</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>${project.total_fee.toLocaleString()}</TableCell>
                        <TableCell>{project.my_percentage}%</TableCell>
                        <TableCell>
                          {project.is_active ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Check className="h-3 w-3" /> Active
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1">
                              <X className="h-3 w-3" /> Inactive
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-bold text-money-primary">
                          ${(project.total_fee * (project.my_percentage / 100)).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleProjectAction('edit', project.id, project.name)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProjectAction('toggle', project.id, project.name)}>
                                {project.is_active ? (
                                  <>
                                    <X className="mr-2 h-4 w-4" /> Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Check className="mr-2 h-4 w-4" /> Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleProjectAction('delete', project.id, project.name)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Current Projects</h3>
              <p className="text-muted-foreground">Add a project to start tracking your support fees.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="forecast" className="mt-2">
          {filteredProjects.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Project Name {getSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('start_date')}
                      >
                        <div className="flex items-center">
                          Start Date {getSortIcon('start_date')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('total_fee')}
                      >
                        <div className="flex items-center">
                          Total Fee {getSortIcon('total_fee')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('my_percentage')}
                      >
                        <div className="flex items-center">
                          Your % {getSortIcon('my_percentage')}
                        </div>
                      </TableHead>
                      <TableHead>Your Share</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>${project.total_fee.toLocaleString()}</TableCell>
                        <TableCell>{project.my_percentage}%</TableCell>
                        <TableCell className="font-bold text-money-warning">
                          ${(project.total_fee * (project.my_percentage / 100)).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleProjectAction('edit', project.id, project.name)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProjectAction('convert', project.id, project.name)}>
                                <Check className="mr-2 h-4 w-4" /> Convert to Current
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleProjectAction('delete', project.id, project.name)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Forecast Projects</h3>
              <p className="text-muted-foreground">Add a forecast project to plan your future income.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
