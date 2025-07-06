import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, DocumentData } from 'firebase/firestore';
import { firestoreConfig } from '@/config/firestoreConfig';
import { useUser } from '@/context/userContext';

interface Team {
  id: string;
  organization_name: string;
  team_name: string;
  team_lead: string;
  team_members: string[];
  created_at: any;
  project_description: string;
  department: string;
  deadline: any;
  updated_at: any;
  project_status: string;
}

interface UseTeamsReturn {
  teams: Team[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeams = (): UseTeamsReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userDetails } = useUser();

  const fetchTeams = async () => {
    if (!userDetails?.organization_name) {
      setError('Organization name not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const instance = firestoreConfig.getInstance();
      const teamsQuery = query(
        collection(instance.getDb(), 'Teams'),
        where('organization_name', '==', userDetails.organization_name)
      );
      
      const querySnapshot = await getDocs(teamsQuery);
      const teamsData: Team[] = [];
      
      querySnapshot.forEach((doc) => {
        teamsData.push({
          id: doc.id,
          ...doc.data()
        } as Team);
      });
      
      setTeams(teamsData);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [userDetails?.organization_name]);

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams
  };
}; 