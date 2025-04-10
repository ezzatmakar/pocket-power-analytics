
import { useState } from 'react';
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
import { Briefcase, Plus, MoreVertical, Edit, Trash, Check, X } from 'lucide-react';
import { mockProjects } from '@/services/mockData';
import { toast } from '@/components/ui/use-toast';

const Projects = () => {
  const [activeTab, setActiveTab] = useState('current');
  
  const [newProject, setNewProject] = useState({
    name: '',
    totalFee: '',
    myPercentage: '',
    startDate: new Date().toISOString().split('T')[0],
    isActive: true,
    isForecast: false
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter projects based on active tab
  const filteredProjects = mockProjects.filter(project => {
    if (activeTab === 'current') return !project.isForecast;
    if (activeTab === 'forecast') return project.isForecast;
    return true;
  });
  
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
    }
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
      
      {/* Project Tabs */}
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="current">Current Projects</TabsTrigger>
          <TabsTrigger value="forecast">Forecast Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <Card key={project.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                      <div className="absolute top-3 right-3">
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
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">
                            {project.isActive ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <Check className="h-3 w-3" /> Active
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center gap-1">
                                <X className="h-3 w-3" /> Inactive
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Total Monthly Fee</p>
                        <p className="font-medium">${project.totalFee.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Your Share ({project.myPercentage}%)</p>
                        <p className="text-xl font-bold text-money-primary">
                          ${(project.totalFee * (project.myPercentage / 100)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Current Projects</h3>
                <p className="text-muted-foreground">Add a project to start tracking your support fees.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="forecast">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <Card key={project.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                      <div className="absolute top-3 right-3">
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
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">
                            <span className="text-amber-600 flex items-center gap-1">
                              Forecast
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Total Monthly Fee</p>
                        <p className="font-medium">${project.totalFee.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Your Share ({project.myPercentage}%)</p>
                        <p className="text-xl font-bold text-money-warning">
                          ${(project.totalFee * (project.myPercentage / 100)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Forecast Projects</h3>
                <p className="text-muted-foreground">Add a forecast project to plan your future income.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
