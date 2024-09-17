import CinemaReservation from "@/components/cinema-reservation/CinemaReservation";
import LanguageSwitcher from "@/components/language-switcher/LanguageSwitcher";

export default function Home() {
  return (
    <div className="bg-white py-10">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <header className="flex justify-end">
            <LanguageSwitcher />
        </header>
        <div className="md:flex">
          <div className="p-8">
            <CinemaReservation />
          </div>
        </div>
      </div>
    </div>
  );
}
