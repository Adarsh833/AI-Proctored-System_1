import React from 'react';
import { Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import Exams from './Components/Exams';
import useTabSwitching from 'src/hooks/useTabSwitching';
import { useDispatch } from 'react-redux';
import { logTabSwitch } from 'src/store/actions/examActions'; // Updated import

const ExamPage = () => {
  const dispatch = useDispatch();

  const handleTabSwitch = () => {
    dispatch(logTabSwitch());
  };

  useTabSwitching(handleTabSwitch);

  return (
    <PageContainer title="Exam Page" description="Active Exams">
      <DashboardCard title="All Active Exams">
        <Exams />
      </DashboardCard>
    </PageContainer>
  );
};

export default ExamPage;