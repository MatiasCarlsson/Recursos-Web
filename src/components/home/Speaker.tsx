import Link from "next/link";
import Image from "next/image";

const styles = {
  image:
    "rounded-full hover:scale-105 transition-all duration-500 shadow-md shadow-buttonColor/30 select-none",
  links:
    "hover:text-textPrimary cursor-pointer hover:underline text-textSecondary font-semibold italic transition-all duration-300",
  containerSpeak: "flex flex-col items-center gap-2 max-w-[36rem] mx-auto",
  spanSpeak:
    "italic text-textSecondary font-bold text-sm hover:underline hover:text-textPrimary transition-all duration-300",
  text: "text-sm text-sec text-center px-4",
};

interface SpeakerProps {
  nombrePersonal: string;
  nombreRedes: string;
  descripcion: string;
  imagenUrl: string;
  enlace: string;
  canal: string;
}

function Speacker({
  nombrePersonal,
  nombreRedes,
  descripcion,
  imagenUrl,
  enlace,
  canal,
}: SpeakerProps) {
  return (
    <div className={styles.containerSpeak}>
      <Image
        src={imagenUrl}
        alt={`Imagen de ${nombrePersonal}`}
        width={100}
        height={100}
        className={styles.image}
      />
      <h3 className={styles.spanSpeak}>{nombrePersonal} </h3>
      <Link href={canal} className={styles.links}>
        @{nombreRedes.toLowerCase()}
      </Link>
      <p className={styles.text}>{descripcion}</p>

      <Link href={enlace} className={styles.links} target="_blank">
        Canal de YouTube
      </Link>
    </div>
  );
}

export default Speacker;
