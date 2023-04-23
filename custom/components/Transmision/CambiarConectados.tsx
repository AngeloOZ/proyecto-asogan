import { useEffect,  useContext } from "react";
import { AuthContext } from "src/auth";

export const CambiarConectados = () => {
  const procesoEnCurso = true;
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
   

        const handleBeforeUnload = async (evento: BeforeUnloadEvent) => {
          if (procesoEnCurso) {
            evento.preventDefault();
            await fetch(
              `/api/compradores/conectados?usuarioid=${user?.usuarioid}&conectado=0`,
              { keepalive: true, method: "PUT" }
            );
          }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);

    


  }, [procesoEnCurso]);
  return null;
};
