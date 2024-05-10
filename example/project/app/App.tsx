import PageHeader from '@availity/page-header';
import { Container, Card } from 'reactstrap';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { SearchForm } from '@/components/Form';

const client = new QueryClient();

const App = () => (
  <QueryClientProvider client={client}>
    <Container className="container-sm">
      <PageHeader appName="Sample Project" appAbbr="SP" feedback />
      <Card>
        <SearchForm />
      </Card>
    </Container>
  </QueryClientProvider>
);

export default App;
