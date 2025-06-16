

import { CreateCompany } from "../components/CrearEmpresa/CrearEmpresa";
import styles from "../css/Home.module.css";

const Empresas = () => {

  return (
    <div className={styles.estilosEmpresa}>
       <CreateCompany/>
    </div>
   
  );
};

export default Empresas;
