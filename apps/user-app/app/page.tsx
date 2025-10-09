import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};



  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
  <>
  
  <div className="text-center">
    <h1 className="text-3xl text-center font-bold underline">Home</h1>
    <Button className="text-center">Button</Button>
    </div>
    
  </>
  );
}
