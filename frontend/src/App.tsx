import { Providers } from "#app/providers.tsx";
import { AppRoutes } from "#app/routes.tsx";

function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
