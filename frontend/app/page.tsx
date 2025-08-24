
"use client"

import Image from "next/image";
import { LandingPage } from "../components/LandingPage";
import SignUpIn from "../components/SignUpIn";
import Providers from "../components/Providers";

export default function Home() {
  return (
   <>
   <Providers>
   <SignUpIn/>
   </Providers>
   </>
  );
}
