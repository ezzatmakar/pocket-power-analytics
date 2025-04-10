
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { checkRLSPolicies, createTestProject } from '@/utils/supabaseRLSChecker';
import { useAuth } from '@/contexts/AuthContext';

interface RLSDebuggerProps {
  visible?: boolean;
}

/**
 * A debug component to test Supabase RLS integration
 * Only use during development
 */
const RLSDebugger = ({ visible = false }: RLSDebuggerProps) => {
  const [checking, setChecking] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const { user } = useAuth();
  
  if (!visible) return null;
  
  const handleCheckRLS = async () => {
    setChecking(true);
    setTestResult(null);
    
    try {
      const result = await checkRLSPolicies(user?.id);
      setTestResult(result ? 'RLS policies are working correctly!' : 'RLS check failed. See console for details.');
    } catch (error) {
      setTestResult('Error checking RLS: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setChecking(false);
    }
  };
  
  const handleCreateTestProject = async () => {
    if (!user) {
      setTestResult('User not authenticated!');
      return;
    }
    
    setChecking(true);
    setTestResult(null);
    
    try {
      const result = await createTestProject(user.id);
      if (result) {
        setTestResult('Test project created successfully! RLS is working.');
      } else {
        setTestResult('Failed to create test project. RLS may not be configured correctly.');
      }
    } catch (error) {
      setTestResult('Error creating test project: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setChecking(false);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-slate-100 border rounded-md shadow-md z-50">
      <h4 className="text-sm font-bold mb-2">RLS Debugger</h4>
      <div className="space-y-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleCheckRLS}
          disabled={checking}
        >
          Check RLS Policies
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleCreateTestProject}
          disabled={checking || !user}
        >
          Create Test Project
        </Button>
        {testResult && (
          <p className="text-xs bg-white p-2 rounded border">
            {testResult}
          </p>
        )}
      </div>
    </div>
  );
};

export default RLSDebugger;
