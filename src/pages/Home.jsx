

import styles from "../css/Home.module.css";
import imagen1 from "../assets/images/valorant1.jpg";
import imagen2 from "../assets/images/valorant2.jpg";
import imagen3 from "../assets/images/valorant3.jpeg";
import Busqueda from "../components/Busqueda/Busqueda";

const Home = () => {
  const myImages = [imagen1, imagen2, imagen3];

  return (
    <div className={styles.homeContainer}>
       <Busqueda/>
    </div>
   
  );
};

export default Home;
