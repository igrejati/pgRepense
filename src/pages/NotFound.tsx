
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-repense-red flex items-center justify-center">
            <span className="text-4xl font-bold text-white">404</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link to="/">
          <Button className="bg-repense-red hover:bg-opacity-90">
            <Home className="mr-2 h-4 w-4" />
            Voltar à página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
