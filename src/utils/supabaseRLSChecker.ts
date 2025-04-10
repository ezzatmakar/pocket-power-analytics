
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Utility to check if Row Level Security policies are correctly set up
 * This is a development helper and can be removed in production
 */
export const checkRLSPolicies = async (userId?: string) => {
  try {
    console.log("Checking RLS policies...");
    
    // Check projects table
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (projectsError) {
      console.error("Projects RLS check failed:", projectsError);
      return false;
    }
    
    // Check income table
    const { data: incomeData, error: incomeError } = await supabase
      .from('income')
      .select('count')
      .limit(1);
    
    if (incomeError) {
      console.error("Income RLS check failed:", incomeError);
      return false;
    }
    
    // Check yearly_trends table
    const { data: trendsData, error: trendsError } = await supabase
      .from('yearly_trends')
      .select('count')
      .limit(1);
    
    if (trendsError) {
      console.error("Yearly trends RLS check failed:", trendsError);
      return false;
    }
    
    console.log("All RLS policies working correctly!");
    return true;
  } catch (error) {
    console.error("Error checking RLS policies:", error);
    return false;
  }
};

/**
 * Helper function to inject a fake project for testing
 * Only use during development
 */
export const createTestProject = async (userId: string) => {
  if (!userId) return;
  
  try {
    const testProject = {
      name: "Test Project",
      total_fee: 1000,
      my_percentage: 50,
      start_date: new Date().toISOString().split('T')[0],
      is_active: true,
      is_forecast: false,
      user_id: userId
    };
    
    const { data, error } = await supabase
      .from('projects')
      .insert([testProject])
      .select();
      
    if (error) {
      throw error;
    }
    
    toast({
      title: "Test Project Created",
      description: "A test project was created successfully. RLS is working!",
    });
    
    return data[0];
  } catch (error) {
    console.error("Error creating test project:", error);
    toast({
      title: "RLS Test Failed",
      description: "Failed to create test project. Check if RLS is set up correctly.",
      variant: "destructive"
    });
    return null;
  }
};
