import { lazy, Suspense } from 'react';
import { ThemeProvider, PageHeader, Card, Container, Alert, Authorize } from '@availity/element';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@availity/hooks';

import { SearchForm } from '@/components/Form';

const LazyPage = lazy(() => import('@/pages/LazyPage'));

const client = new QueryClient();

const AppContent = () => {
  const { data: user } = useCurrentUser();

  return (
    <Authorize permissions={['7777']} unauthorized={<div>You are not authorized to view this content.</div>}>
      <PageHeader headerText="Sample Project" feedback />
      <Container>
        {user && (
          <Alert severity="success">
            Welcome, {user.firstName} {user.lastName}
          </Alert>
        )}
        {__DEV__ && <Alert severity="info">Running in development mode</Alert>}
        <Card>
          <SearchForm />
        </Card>
        <Suspense fallback={<div>Loading...</div>}>
          <LazyPage />
        </Suspense>
      </Container>
    </Authorize>
  );
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={client}>
      <AppContent />
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
