import { GiJugglingSeal } from "react-icons/gi";
import { FaEthereum } from "react-icons/fa";

export default function Logo() {
  return (
    <div className="flex h-screen w-full items-center justify-center pb-12">
      <div className="flex gap-8">
        <GiJugglingSeal size={256} />
        <FaEthereum size={256} />
      </div>
    </div>
  );
}
