import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Login from './pages/Auth/Login';
import GeneralDataManagement from './pages/DataManagement/general-data-management/GeneralDataManagement.view';
import DetailGeneralDataManagement from './pages/DataManagement/general-data-management/detail-general-data-management/DetailGeneralDataManagement.view';
import Report from './pages/Report/Report.view';
import Compare from './pages/Compare/Compare.view';
import DetailDataManagement from './pages/DataManagement/detail-data-management/DetailDataManagement.view';
import SubDetailDataManagement from './pages/DataManagement/detail-data-management/sub-detail-data-management/SubDetailDataManagement.view';
import DetailReport from './pages/Report/detail-report/DetailReport';
import GroundTruth from './pages/DataManagement/ground-truth/GroundTruth.view';
import AddAppoint from './pages/DataManagement/ground-truth/add-ground-truth/add-appoint/AddAppoint';
import CreateCompare from './pages/Compare/create-compare/CreateCompare';
import DetailCompare from './pages/Compare/detail-compare/DetailCompare';
import DetailGroundTruth from './pages/DataManagement/ground-truth/detail-ground-truth/DetailGroundTruth.view';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );


const Engine = Loader(lazy(() => import('src/pages/Engine/Engine.view')));
const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="manage-engine" replace />
      },
      {
        path: 'manage-engine',
        element: <Engine />
      },
      {
        path: '',
        children: [
          {
            path: '',
            element: <Navigate to="manage-data-manage" replace />
          },
          {
            path: 'general-data-management',
            element: <GeneralDataManagement />
          },
          {
            path: 'general-data-management/:id',
            element: <DetailGeneralDataManagement />
          },
         
          {
            path: 'manage-data-detail',
            element: <DetailDataManagement />
          },
          {
            path: 'manage-data-detail/:id',
            element: <SubDetailDataManagement />
          },
          {
            path: 'ground-truth',
            element: <GroundTruth />
          },
          {
            path: 'ground-truth/:id',
            element: <DetailGroundTruth />
          },
          {
            path: 'ground-truth/add-appoint',
            element: <AddAppoint />
          }
        ]
      },
      {
        path: 'compare',
        children: [
          {
            path: "",
            element: <Compare />,
          },
          {
            path: "create",
            element: <CreateCompare />
          },
          {
            path: "edit",
            element: <CreateCompare />
          },
          {
            path: ":id",
            element: <DetailCompare />
          }
        ]
      },
      {
        path: 'report',
        element: <Report />
      },
      {
        path: 'report/:id',
        element: <DetailReport />
      }
    ]
  }
];

export default routes;
