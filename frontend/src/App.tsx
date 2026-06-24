import { Providers } from "#app/providers.tsx";
import { AppRoutes } from "#app/routes.tsx";
import { ErrorBoundary } from "#shared/components/ErrorBoundary.tsx";

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <AppRoutes />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
