import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Database, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { migrateDataToSupabase } from '../services/migrateData';

export function DataMigration() {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: any } | null>(null);

  const handleMigration = async () => {
    setMigrating(true);
    setResult(null);

    const migrationResult = await migrateDataToSupabase();
    setResult(migrationResult);
    setMigrating(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          Database Migration
        </CardTitle>
        <CardDescription>
          Migrate your existing mock data to Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This will migrate all mock data (students, projects, tasks, study materials, and
            portfolios) to your Supabase database.
          </p>
          <p className="text-sm text-muted-foreground">
            The migration is safe and will not duplicate existing data.
          </p>
        </div>

        <Button
          onClick={handleMigration}
          disabled={migrating}
          size="lg"
          className="w-full"
        >
          {migrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating Data...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Start Migration
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.success
                ? 'Data migration completed successfully! All your data is now stored in Supabase.'
                : `Migration failed: ${result.error?.message || 'Unknown error'}`}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Migration Checklist:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>✓ Students & Users</li>
            <li>✓ Projects & Tasks</li>
            <li>✓ Comments</li>
            <li>✓ Study Materials</li>
            <li>✓ Portfolio Data</li>
            <li>✓ Skills & Achievements</li>
            <li>✓ Admin Feedback</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
