
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
import { Briefcase, Plus, MoreVertical, Edit, Trash, Check, X, Search, ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { mockProjects } from '@/services/mockData';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";

// Type definition for project data
interface Project {
  id: string;
  name: string;
  totalFee: number;
  myPercentage: number;
  startDate: string;
  isActive: boolean;
  isForecast: boolean;
}

// Type definition for sort config
interface SortConfig {
  key: keyof Project | null;
  direction: 'asc' | 'desc';
}

const Projects = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'desc'
  });
  
  const [newProject, setNewProject] = useState({
    name: '',
    totalFee: '',
    myPercentage: '',
    startDate: new Date().toISOString().split('T')[0],
    isActive: true,
    isForecast: false
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Project Added",
      description: `${newProject.name} has been added to your ${newProject.isForecast ? 'forecast' : 'current'} projects.`,
    });
    
    setIsDialogOpen(false);
    setNewProject({
      name: '',
      totalFee: '',
      myPercentage: '',
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
      isForecast: false
    });
  };
  
  // Handle project actions
  const handleProjectAction = (action: string, projectId: string, projectName: string) => {
    if (action === 'delete') {
      toast({
        title: "Project Deleted",
        description: `${projectName} has been removed from your projects.`,
      });
    } else if (action === 'edit') {
      toast({
        title: "Edit Project",
        description: `You can now edit ${projectName}.`,
      });
    } else if (action === 'toggle') {
      toast({
        title: "Project Status Updated",
        description: `${projectName} has been ${projectName.includes('inactive') ? 'activated' : 'deactivated'}.`,
      });
    } else if (action === 'convert') {
      toast({
        title: "Project Converted",
        description: `${projectName} has been converted to a current project.`,
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
      if (activeTab === 'current') return !project.isForecast;
      if (activeTab === 'forecast') return project.isForecast;
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
        result = result.filter(project => project.isActive);
      } else if (statusFilter === 'inactive') {
        result = result.filter(project => !project.isActive);
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
                    value={newProject.totalFee}
                    onChange={(e) => setNewProject({...newProject, totalFee: e.target.value})}
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
                    value={newProject.myPercentage}
                    onChange={(e) => setNewProject({...newProject, myPercentage: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="isForecast">Add as Forecast Project</Label>
                  <Switch
                    id="isForecast"
                    checked={newProject.isForecast}
                    onCheckedChange={(checked) => setNewProject({...newProject, isForecast: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active Project</Label>
                  <Switch
                    id="isActive"
                    checked={newProject.isActive}
                    onCheckedChange={(checked) => setNewProject({...newProject, isActive: checked})}
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
                        onClick={() => handleSort('startDate')}
                      >
                        <div className="flex items-center">
                          Start Date {getSortIcon('startDate')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('totalFee')}
                      >
                        <div className="flex items-center">
                          Total Fee {getSortIcon('totalFee')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('myPercentage')}
                      >
                        <div className="flex items-center">
                          Your % {getSortIcon('myPercentage')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('isActive')}
                      >
                        <div className="flex items-center">
                          Status {getSortIcon('isActive')}
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
                        <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>${project.totalFee.toLocaleString()}</TableCell>
                        <TableCell>{project.myPercentage}%</TableCell>
                        <TableCell>
                          {project.isActive ? (
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
                          ${(project.totalFee * (project.myPercentage / 100)).toLocaleString()}
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
                                {project.isActive ? (
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
                        onClick={() => handleSort('startDate')}
                      >
                        <div className="flex items-center">
                          Start Date {getSortIcon('startDate')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('totalFee')}
                      >
                        <div className="flex items-center">
                          Total Fee {getSortIcon('totalFee')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort('myPercentage')}
                      >
                        <div className="flex items-center">
                          Your % {getSortIcon('myPercentage')}
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
                        <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>${project.totalFee.toLocaleString()}</TableCell>
                        <TableCell>{project.myPercentage}%</TableCell>
                        <TableCell className="font-bold text-money-warning">
                          ${(project.totalFee * (project.myPercentage / 100)).toLocaleString()}
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
