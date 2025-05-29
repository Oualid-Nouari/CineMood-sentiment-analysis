import Header from "./components/Header";
import Welcome from "./components/Welcome";
import BgImg from "./imgs/bg-img.jpg"

export default function Home() {
  return (
    <div className="">
      <img src="/imgs/bg-img.jpg" alt="" className="absolute inset-0 w-full h-full object-cover -z-10" />
      <div className="absolute w-full h-full bg-black opacity-80"></div>
      <Header />
      <Welcome /> 
    </div>
  );
}
