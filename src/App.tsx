import { StoreProvider } from "./store/index";
import AppRoutes from "./routes";

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppRoutes />
    </StoreProvider>
  );
};

export default App;
