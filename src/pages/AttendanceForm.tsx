
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAttendanceForm } from '@/hooks/useAttendanceForm';
import StudentListCard from '@/components/attendance/StudentListCard';
import SessionSummaryCard from '@/components/attendance/SessionSummaryCard';
import AttendanceHeader from '@/components/attendance/AttendanceHeader';
import LoadingState from '@/components/attendance/LoadingState';
import NotFoundState from '@/components/attendance/NotFoundState';

const AttendanceForm = () => {
  const { sessionId } = useParams();
  
  const {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    isSubmitting,
    notes,
    setNotes,
    loading,
    sessionData,
    courseName,
    attendanceData,
    toggleAttendance,
    updateJustification,
    markAllPresent,
    markAllAbsent,
    saveAttendance,
    presentCount,
    absentCount,
    totalCount
  } = useAttendanceForm({
    userId: "mock-user-id",
    sessionId
  });

  if (loading) {
    // Pass the required userName prop to LoadingState
    return <LoadingState userName="Líder" />;
  }

  if (!sessionData) {
    return <NotFoundState />;
  }

  return (
    <DashboardLayout userRole="leader" userName="Líder">
      <div className="space-y-6">
        <AttendanceHeader sessionData={sessionData} courseName={courseName} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StudentListCard
            attendanceData={attendanceData}
            filter={filter}
            searchTerm={searchTerm}
            setFilter={setFilter}
            setSearchTerm={setSearchTerm}
            toggleAttendance={toggleAttendance}
            updateJustification={updateJustification}
            markAllPresent={markAllPresent}
            markAllAbsent={markAllAbsent}
          />

          <SessionSummaryCard
            notes={notes}
            setNotes={setNotes}
            presentCount={presentCount}
            absentCount={absentCount}
            totalCount={totalCount}
            isSubmitting={isSubmitting}
            saveAttendance={saveAttendance}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceForm;
