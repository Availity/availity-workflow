import { ThemeProvider, PageHeader, Card, Container } from '@availity/element';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { SearchForm } from '@/components/Form';

const client = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={client}>
      <Container>
        <PageHeader headerText="Sample Project" feedback />
        <Card>
          <SearchForm />
        </Card>
      </Container>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
