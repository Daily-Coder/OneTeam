'use client';

import { firestoreConfig } from "@/config/firestoreConfig";
import { useUser } from "@/context/userContext";
import { DocumentData } from "firebase-admin/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import { Timestamp } from 'firebase/firestore';
import { Users, CalendarDays, Folder } from 'lucide-react';

function getDeadlineStatus(deadline: Timestamp | undefined) {
  if (!deadline) return { label: 'Unknown', color: 'bg-gray-100 text-gray-500' };

  const today = new Date();
  const deadlineDate = deadline.toDate();

  if (deadlineDate.toDateString() === today.toDateString()) {
    return { label: 'Due Today', color: 'bg-yellow-100 text-yellow-600' };
  }

  if (deadlineDate < today) {
    return { label: 'Overdue', color: 'bg-red-100 text-red-600' };
  }

  return { label: 'Upcoming', color: 'bg-green-100 text-green-600' };
}



export default function TeamOverview() {

  const [myTeams, setMyTeams] = useState<DocumentData[]>([]);
  const [teamsFetched, setTeamsFetched] = useState<boolean>(false);
  const { userDetails } = useUser();

  useEffect(() => {
    (async () => {
      const instance = firestoreConfig.getInstance()
      try {
        const docSnap = await getDocs(query(collection(instance.getDb(), 'Teams'), where('organization_name', '==', userDetails?.organization_name), where('team_members', 'array-contains', userDetails?.employee_id)));
        const temp: DocumentData[] = []
        docSnap.docs.map(doc => temp.push({ id: doc.id, ...doc.data() }));
        setMyTeams(temp)
        setTeamsFetched(true)
      }
      catch (err) {
        console.log("error while getting teams", err);
      }
    })()
  })
  return (
    <div className="bg-white p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">
        Your Teams
      </h2>

      {!teamsFetched ? (
        <main className="w-full h-[200px] flex items-center justify-center text-gray-500 text-sm">
          Fetching your data...
        </main>
      ) : myTeams.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          You are not assigned to any team yet.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTeams.map((team) => {
            const status = getDeadlineStatus(team.deadline);

            return (
              <li
                key={team.id}
                className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-gray-200 transition-all shadow-sm hover:shadow-md"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {team.team_name}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Manager */}
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>
                    <span className="font-medium text-gray-700">Manager:</span>{' '}
                    {team.team_lead}
                  </span>
                </p>

                {/* Project Description */}
                <p className="text-gray-700 text-sm mb-3 flex items-start gap-2">
                  <Folder className="w-4 h-4 mt-0.5 text-indigo-500" />
                  {team.project_description}
                </p>

                {/* Deadline */}
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-emerald-500" />
                  <span>
                    <span className="font-medium">Deadline:</span>{' '}
                    {team.deadline.toDate().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}